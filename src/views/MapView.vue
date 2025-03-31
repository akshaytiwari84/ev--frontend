<template>
    <div class="map-container">
      <v-card class="map-card">
        <v-card-title class="map-title">
          <v-icon left color="primary">mdi-map</v-icon>
          Charging Stations Map
          <v-spacer></v-spacer>
          <v-btn
            small
            icon
            @click="$emit('close')"
            v-if="isDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <div id="map" ref="mapContainer" class="map"></div>
        </v-card-text>
      </v-card>
      
      <!-- Station Info Popup -->
      <v-dialog
        v-model="stationDialog.show"
        max-width="400px"
      >
        <v-card class="ev-card station-popup">
          <v-card-title class="popup-title">
            {{ stationDialog.station.name }}
            <v-chip 
              small 
              class="ml-2"
              :color="getStatusColor(stationDialog.station.status)"
              text-color="white"
              pill
            >
              {{ stationDialog.station.status }}
            </v-chip>
          </v-card-title>
          
          <v-card-text class="popup-content">
            <div class="station-details">
              <div class="detail-item">
                <v-icon color="primary" small>mdi-flash</v-icon>
                <span>{{ stationDialog.station.powerOutput }} kW</span>
              </div>
              
              <div class="detail-item">
                <v-icon color="primary" small>mdi-ev-plug-type2</v-icon>
                <span>{{ formatConnectorType(stationDialog.station.connectorType) }}</span>
              </div>
              
              <div class="detail-item">
                <v-icon color="primary" small>mdi-map-marker</v-icon>
                <span>{{ formatCoordinates(stationDialog.station.latitude, stationDialog.station.longitude) }}</span>
              </div>
              
              <div class="detail-item">
                <v-icon color="primary" small>mdi-clock-outline</v-icon>
                <span>Added: {{ formatDate(stationDialog.station.createdAt) }}</span>
              </div>
            </div>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions>
            <v-btn
              text
              color="primary"
              @click="editStation(stationDialog.station)"
            >
              <v-icon left small>mdi-pencil</v-icon>
              EDIT
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <v-btn
              text
              color="error"
              @click="confirmDelete(stationDialog.station)"
            >
              <v-icon left small>mdi-delete</v-icon>
              DELETE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MapView',
    props: {
      stations: {
        type: Array,
        required: true
      },
      isDialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        map: null,
        markers: [],
        stationDialog: {
          show: false,
          station: {}
        }
      };
    },
    mounted() {
      this.initMap();
    },
    watch: {
      stations: {
        handler() {
          this.updateMarkers();
        },
        deep: true
      }
    },
    methods: {
      initMap() {
        // Check if OpenLayers is available
        if (window.ol) {
          this.initOpenLayersMap();
        } else {
          // Load OpenLayers script
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js';
          script.onload = () => {
            // Load OpenLayers CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/ol@v7.4.0/ol.css';
            document.head.appendChild(link);
            
            this.initOpenLayersMap();
          };
          document.head.appendChild(script);
        }
      },
      
      initOpenLayersMap() {
        const { Map, View } = ol;
        const { Tile: TileLayer, Vector: VectorLayer } = ol.layer;
        const { OSM, Vector: VectorSource } = ol.source;
        const { Style, Icon, Text, Fill, Stroke } = ol.style;
        
        // Create vector source for markers
        const vectorSource = new VectorSource();
        
        // Create vector layer for markers
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        
        // Create map
        this.map = new Map({
          target: this.$refs.mapContainer,
          layers: [
            new TileLayer({
              source: new OSM()
            }),
            vectorLayer
          ],
          view: new View({
            center: [0, 0],
            zoom: 2
          })
        });
        
        // Add click interaction
        this.map.on('click', (event) => {
          const feature = this.map.forEachFeatureAtPixel(event.pixel, feature => feature);
          if (feature) {
            const stationId = feature.get('id');
            const station = this.stations.find(s => s.id === stationId);
            if (station) {
              this.showStationDialog(station);
            }
          }
        });
        
        // Add markers for stations
        this.updateMarkers();
      },
      
      updateMarkers() {
        if (!this.map) return;
        
        const { Point } = ol.geom;
        const { Feature } = ol;
        const { Style, Icon, Text, Fill, Stroke } = ol.style;
        const { Vector: VectorSource } = ol.source;
        
        // Get vector layer
        const vectorLayer = this.map.getLayers().getArray()[1];
        const vectorSource = vectorLayer.getSource();
        
        // Clear existing markers
        vectorSource.clear();
        
        // Add markers for stations
        this.stations.forEach(station => {
          // Convert coordinates to OpenLayers format
          const coords = ol.proj.fromLonLat([parseFloat(station.longitude), parseFloat(station.latitude)]);
          
          // Create feature
          const feature = new Feature({
            geometry: new Point(coords),
            id: station.id,
            name: station.name,
            status: station.status
          });
          
          // Set style based on status
          feature.setStyle(new Style({
            image: new Icon({
              anchor: [0.5, 1],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: this.getMarkerIcon(station.status),
              scale: 0.6
            }),
            text: new Text({
              text: station.name,
              offsetY: 15,
              fill: new Fill({
                color: '#333'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2
              })
            })
          }));
          
          // Add feature to source
          vectorSource.addFeature(feature);
        });
        
        // Fit view to stations if available
        if (this.stations.length > 0) {
          const extent = vectorSource.getExtent();
          this.map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15
          });
        }
      },
      
      getMarkerIcon(status) {
        // Return marker icon based on status
        switch (status) {
          case 'active':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker.svg'; // Green marker
          case 'maintenance':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker-alert.svg'; // Orange marker
          case 'inactive':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker-off.svg'; // Grey marker
          default:
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker.svg'; // Default marker
        }
      },
      
      showStationDialog(station) {
        this.stationDialog.station = { ...station };
        this.stationDialog.show = true;
      },
      
      editStation(station) {
        this.stationDialog.show = false;
        this.$emit('edit', station);
      },
      
      confirmDelete(station) {
        this.stationDialog.show = false;
        this.$emit('delete', station);
      },
      
      getStatusColor(status) {
        const colors = {
          active: "success",
          inactive: "grey",
          maintenance: "warning"
        };
        return colors[status] || "grey";
      },
      
      formatConnectorType(type) {
        const typeMap = {
          type2: "Type 2",
          ccs: "CCS",
          chademo: "CHAdeMO",
          tesla: "Tesla"
        };
        return typeMap[type] || type;
      },
      
      formatCoordinates(lat, lng) {
        return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
      },
      
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .map-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .map-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .map-title {
    background-color: #fff;
    color: #00796B;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .map {
    width: 100%;
    height: 500px;
    background-color: #f5f5f5;
  }
  
  .station-popup {
    border-radius: 12px;
  }
  
  .popup-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: #00796B;
  }
  
  .popup-content {
    padding-top: 10px;
  }
  
  /* Station details styling */
  .station-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: #546e7a;
  }
  </style>