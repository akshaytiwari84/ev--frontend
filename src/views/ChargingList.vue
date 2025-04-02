
<template>
    <v-container fluid class="ev-container fill-height pa-4">
      <v-row class="ma-0">
        <v-row cols="12">
          <div class="header d-flex justify-space-between w-100 align-center mb-8 pa-4 rounded-lg" style="background: linear-gradient(90deg, #f5f7fa, #e4e7eb);">
            <div class="d-flex align-center">
              <v-btn
                icon
                color="primary"
                class="ml-2"
                @click="toggleFilters"
                title="Toggle Filters"
                large
              >
                <v-icon size="28">mdi-filter</v-icon>
              </v-btn>
              <v-btn-toggle
                v-model="viewMode"
                color="primary"
                rounded
                dense
                mandatory
                class="ml-4"
              >
                <v-btn value="list" class="px-4">
                  <v-icon left>mdi-view-list</v-icon>
                  List
                </v-btn>
                <v-btn value="map" class="px-4">
                  <v-icon left>mdi-map</v-icon>
                  Map
                </v-btn>
              </v-btn-toggle>
            </div>
            <div class="d-flex align-center">
              <v-btn
                color="primary"
                class="ev-button mr-4"
                elevation="3"
                rounded
                large
                @click="openAddDialog"
              >
                <v-icon left>mdi-plus</v-icon>
                Add Station
              </v-btn>
               <!-- New Refresh Button with Loading Animation -->
  <v-btn
    color="secondary"
    class="ev-button mr-4"
    elevation="3"
    rounded
    large
    @click="toggleRefreshLoading"
    :loading="refreshLoading"
  >
    <v-icon left>mdi-refresh</v-icon>
    Refresh Data
  </v-btn>
              
              <v-btn
                color="error"
                elevation="3"
                rounded
                large
                @click="logout"
              >
                <v-icon left>mdi-logout</v-icon>
                Logout
              </v-btn>
            </div>
            
          </div>
        </v-row>
      </v-row>
  
      <!-- Filter Section -->
      <v-expand-transition class="w-100">
        <v-row v-if="filters.showFilters">
          <v-col cols="12">
            <v-card class="filter-card mb-4 pa-4" elevation="2" style="background: linear-gradient(to bottom, #ffffff, #f9f9f9); border-radius: 12px;">
              <v-card-title class="filter-title text-h6 font-weight-medium">
                <v-icon left color="primary">mdi-filter</v-icon>
                Filter Stations
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      v-model="filters.status"
                      :items="statusOptions"
                      label="Status"
                      clearable
                      filled
                      dense
                      class="filter-select"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      v-model="filters.connectorType"
                      :items="connectorTypeOptions"
                      item-text="text"
                      item-value="value"
                      label="Connector Type"
                      clearable
                      filled
                      dense
                      class="filter-select"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="filters.minPowerOutput"
                      label="Min Power (kW)"
                      type="number"
                      filled
                      dense
                      class="filter-input"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      v-model="filters.maxPowerOutput"
                      label="Max Power (kW)"
                      type="number"
                      filled
                      dense
                      class="filter-input"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text color="grey darken-1" class="text-capitalize" @click="resetFilters">
                  Reset
                </v-btn>
                <v-btn
                  color="primary"
                  rounded
                  elevation="2"
                  class="px-6"
                  @click="applyFilters"
                >
                  Apply Filters
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-expand-transition>
  
      <!-- Loading Indicator -->
      <v-row v-if="loading">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-3">Loading charging stations...</div>
        </v-col>
      </v-row>
  
      <!-- List View -->
      <div v-if="viewMode === 'list'">
        <v-row>
          <v-col
            v-for="station in chargingStations"
            :key="station.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="ev-card pa-3"
              elevation="3"
              height="100%"
              style="transition: transform 0.2s;"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :style="{ transform: hover ? 'scale(1.02)' : 'scale(1)' }"
            >
              <v-card-title class="ev-station-title text-h6 font-weight-medium">
                {{ station.name }}
                <v-chip
                  small
                  class="ml-2"
                  :color="getStatusColor(station.status)"
                  text-color="white"
                  pill
                >
                  {{ station.status }}
                </v-chip>
              </v-card-title>
              <v-card-text>
                <div class="station-details">
                  <div class="detail-item d-flex align-center mb-2">
                    <v-icon color="primary" small class="mr-2">mdi-flash</v-icon>
                    <span>{{ station.powerOutput }} kW</span>
                  </div>
                  <div class="detail-item d-flex align-center mb-2">
                    <v-icon color="primary" small class="mr-2">mdi-ev-plug-type2</v-icon>
                    <span>{{ formatConnectorType(station.connectorType) }}</span>
                  </div>
                  <div class="detail-item d-flex align-center mb-2">
                    <v-icon color="primary" small class="mr-2">mdi-map-marker</v-icon>
                    <span>{{ formatCoordinates(station.latitude, station.longitude) }}</span>
                  </div>
                  <div class="detail-item d-flex align-center mb-2">
                    <v-icon color="primary" small class="mr-2">mdi-clock-outline</v-icon>
                    <span>Added: {{ formatDate(station.createdAt) }}</span>
                  </div>
                </div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="card-actions px-4">
                <v-btn text color="primary" class="text-capitalize" @click="openEditDialog(station)">
                  <v-icon left small>mdi-pencil</v-icon>
                  Edit
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="error" class="text-capitalize" @click="confirmDelete(station)">
                  <v-icon left small>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Empty State for List View -->
        <v-row v-if="chargingStations.length === 0 && !loading">
          <v-col cols="12" class="text-center">
            <v-card class="ev-card empty-state pa-8" elevation="3" max-width="500" mx="auto">
              <v-img
                src="/empty-state.png"
                max-height="180"
                contain
                class="mb-4"
              ></v-img>
              <h2 class="ev-subtitle mb-4 text-h5">No Charging Stations Found</h2>
              <p class="mb-6 subtitle-1">Start by adding your first charging station</p>
              <v-btn
                color="primary"
                class="ev-button"
                elevation="3"
                rounded
                @click="openAddDialog"
              >
                <v-icon left>mdi-plus</v-icon>
                Add Your First Station
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>
  
      <!-- Map View -->
      <div v-else-if="viewMode === 'map'" class="map-view-container">
        <v-card class="map-card" elevation="2" style="border-radius: 12px; overflow: hidden;">
          <div id="map" ref="mapContainer" class="map" style="height: 600px;"></div>
        </v-card>
        <v-card
          v-if="chargingStations.length === 0"
          class="ev-card empty-state-overlay pa-6"
          elevation="4"
          max-width="400"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 255, 255, 0.95);"
        >
          <v-img
            src="/empty-state.png"
            max-height="150"
            contain
            class="mb-4"
          ></v-img>
          <h2 class="ev-subtitle mb-4 text-h5">No Stations to Display</h2>
          <p class="mb-6 subtitle-1">Add your first charging station to see it on the map</p>
          <v-btn
            color="primary"
            class="ev-button"
            elevation="3"
            rounded
            @click="openAddDialog"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Your First Station
          </v-btn>
        </v-card>
      </div>
  
      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog.show" max-width="600px">
        <v-card class="ev-card dialog-card pa-4" style="border-radius: 16px;">
          <v-card-title class="ev-dialog-title text-h5 font-weight-medium pb-4">
            {{ dialog.isEdit ? 'Edit Charging Station' : 'Add New Charging Station' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="stationForm" v-model="dialog.formValid" lazy-validation>
              <v-text-field
                v-model="dialog.station.name"
                :rules="[v => !!v || 'Name is required']"
                label="Station Name"
                required
                filled
                dense
                class="ev-input"
                color="primary"
              ></v-text-field>
              <div class="d-flex">
                <v-text-field
                  v-model="dialog.station.latitude"
                  :rules="[
                    v => !!v || 'Latitude is required',
                    v => (v >= -90 && v <= 90) || 'Latitude must be between -90 and 90'
                  ]"
                  label="Latitude"
                  type="number"
                  step="0.0001"
                  required
                  filled
                  dense
                  class="ev-input mr-2"
                  color="primary"
                ></v-text-field>
                <v-text-field
                  v-model="dialog.station.longitude"
                  :rules="[
                    v => !!v || 'Longitude is required',
                    v => (v >= -180 && v <= 180) || 'Longitude must be between -180 and 180'
                  ]"
                  label="Longitude"
                  type="number"
                  step="0.0001"
                  required
                  filled
                  dense
                  class="ev-input"
                  color="primary"
                ></v-text-field>
              </div>
              <div class="d-flex">
                <v-select
                  v-model="dialog.station.status"
                  :items="statusOptions"
                  label="Status"
                  required
                  filled
                  dense
                  class="ev-input mr-2"
                  color="primary"
                ></v-select>
                <v-select
                  v-model="dialog.station.connectorType"
                  :items="connectorTypeOptions"
                  item-text="text"
                  item-value="value"
                  label="Connector Type"
                  required
                  filled
                  dense
                  class="ev-input"
                  color="primary"
                ></v-select>
              </div>
              <v-text-field
                v-model="dialog.station.powerOutput"
                :rules="[
                  v => !!v || 'Power Output is required',
                  v => v > 0 || 'Power Output must be greater than 0'
                ]"
                label="Power Output (kW)"
                type="number"
                step="0.1"
                required
                filled
                dense
                class="ev-input"
                color="primary"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-end pb-4">
            <v-btn text color="grey darken-1" class="text-capitalize" @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn
              :disabled="!dialog.formValid"
              color="primary"
              rounded
              elevation="2"
              class="px-6"
              @click="saveStation"
            >
              {{ dialog.isEdit ? 'Update' : 'Add' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Location Picker Dialog -->
      <v-dialog v-model="locationPicker.show" max-width="800px" height="600px">
        <v-card class="location-picker-card" style="border-radius: 16px;">
          <v-card-title class="location-picker-title text-h6 font-weight-medium">
            Pick Location
            <v-spacer></v-spacer>
            <v-btn icon @click="locationPicker.show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="location-picker-content">
            <div id="location-map" ref="locationMapContainer" class="location-map" style="height: 400px;"></div>
            <div class="location-coordinates d-flex align-center mt-2">
              <v-icon color="primary" small class="mr-2">mdi-map-marker</v-icon>
              <span>Selected: {{ formatCoordinates(locationPicker.latitude, locationPicker.longitude) }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey darken-1" class="text-capitalize" @click="locationPicker.show = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              rounded
              elevation="2"
              class="px-6"
              @click="setLocationFromPicker"
            >
              Confirm Location
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Station Info Dialog (for Map View) -->
      <v-dialog v-model="stationInfoDialog.show" max-width="400px">
        <v-card class="ev-card station-info-card pa-4" v-if="stationInfoDialog.station" style="border-radius: 16px;">
          <v-card-title class="station-info-title text-h6 font-weight-medium">
            {{ stationInfoDialog.station.name }}
            <v-chip
              small
              class="ml-2"
              :color="getStatusColor(stationInfoDialog.station.status)"
              text-color="white"
              pill
            >
              {{ stationInfoDialog.station.status }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div class="station-details">
              <div class="detail-item d-flex align-center mb-2">
                <v-icon color="primary" small class="mr-2">mdi-flash</v-icon>
                <span>{{ stationInfoDialog.station.powerOutput }} kW</span>
              </div>
              <div class="detail-item d-flex align-center mb-2">
                <v-icon color="primary" small class="mr-2">mdi-ev-plug-type2</v-icon>
                <span>{{ formatConnectorType(stationInfoDialog.station.connectorType) }}</span>
              </div>
              <div class="detail-item d-flex align-center mb-2">
                <v-icon color="primary" small class="mr-2">mdi-map-marker</v-icon>
                <span>{{ formatCoordinates(stationInfoDialog.station.latitude, stationInfoDialog.station.longitude) }}</span>
              </div>
              <div class="detail-item d-flex align-center mb-2">
                <v-icon color="primary" small class="mr-2">mdi-clock-outline</v-icon>
                <span>Added: {{ formatDate(stationInfoDialog.station.createdAt) }}</span>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="px-4">
            <v-btn text color="primary" class="text-capitalize" @click="openEditFromInfo">
              <v-icon left small>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="error" class="text-capitalize" @click="confirmDeleteFromInfo">
              <v-icon left small>mdi-delete</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="confirmDialog.show" max-width="400px">
        <v-card class="ev-card dialog-card pa-4" style="border-radius: 16px;">
          <v-card-title class="ev-dialog-title text-h6 font-weight-medium">
            Confirm Deletion
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete <strong>{{ confirmDialog.stationName }}</strong>? 
            This action cannot be undone.
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey darken-1" class="text-capitalize" @click="confirmDialog.show = false">
              Cancel
            </v-btn>
            <v-btn
              color="error"
              rounded
              elevation="2"
              class="px-6"
              @click="deleteStation"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for Notifications -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="5000"
        elevation="4"
        rounded="pill"
        top
        transition="slide-y-transition"
      >
        <div class="d-flex align-center">
          <v-icon v-if="snackbar.color === 'success'" class="mr-2">mdi-check-circle</v-icon>
          <v-icon v-else class="mr-2">mdi-alert-circle</v-icon>
          {{ snackbar.message }}
        </div>
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import chargingStationService from '../services/chargingStationService';

  export default {


    name: 'ChargingStationsList',

    data() {

  return {
    viewMode: 'list', // 'list' or 'map'
    map: null,
    markers: [],
    
    // Replace hardcoded data with empty array
    chargingStations: [],
    refreshLoading: false,
    refreshInterval: null,
    // Add loading state
    loading: false,
    
    // Add filter controls
    
    filters: {
      status: null,
      connectorType: null,
      minPowerOutput: null,
      maxPowerOutput: null,
      showFilters: false
    },
    
    // Dialog data for add/edit
    dialog: {
      show: false,
      isEdit: false,
      formValid: false,
      station: {
        id: null,
        name: "",
        latitude: null,
        longitude: null,
        status: "active",
        powerOutput: null,
        connectorType: "type2"
      }
    },
    
    // Location picker data
    locationPicker: {
      show: false,
      map: null,
      marker: null,
      latitude: null,
      longitude: null
    },
    
    // Station info dialog for map view
    stationInfoDialog: {
      show: false,
      station: null
    },
    
    // Confirmation dialog for delete
    confirmDialog: {
      show: false,
      stationId: null,
      stationName: ""
    },
    
    // Snackbar for notifications
    snackbar: {
      show: false,
      message: "",
      color: "success"
    },
    
    statusOptions: [
      "active",
      "inactive",
    ],
    
    connectorTypeOptions: ['type2','ccs','chademo' ,'tesla'
     
    ]
  };
},
    
    watch: {
  viewMode(newValue, oldValue) {
    // When switching from map to list
    if (oldValue === 'map' && newValue === 'list') {
      // Properly destroy the map
      if (this.map) {
        console.log('Destroying map');
        this.map.remove();
        this.map = null;
      }
    }
    
    // When switching to map view
    if (newValue === 'map') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Only initialize if not already initialized
        if (!this.map) {
          console.log('Initializing map after switch');
          this.initMap();
        } else {
          // If map exists but might be in bad state, invalidate size
          console.log('Refreshing existing map');
          this.map.invalidateSize();
        }
      }, 100);
    }
  }
},
    
mounted() {
  // Load OpenLayers script
  this.loadLeafletScript();
  
  // Fetch charging stations when component mounts
  this.fetchChargingStations();
  
  // Set up global functions for marker popups (keep your existing code)
  window.editStation = (id) => {
    const station = this.chargingStations.find(s => s.id === id);
    if (station) {
      this.openEditDialog(station);
    }
  };
  
  window.deleteStation = (id) => {
    const station = this.chargingStations.find(s => s.id === id);
    if (station) {
      this.confirmDelete(station);
    }
  };
},
    
    methods: {
         // Add this method to fetch charging stations

         toggleRefreshLoading() {
    // If already refreshing, cancel it
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      this.refreshLoading = false;
      return;
    }
    
    this.refreshLoading = true;
    
    // First immediate refresh
    this.fetchChargingStations();
    
    // Create an interval that toggles the loading state every 2 seconds
    this.refreshInterval = setInterval(() => {
      // Toggle loading state off briefly
      this.refreshLoading = false;
      
      // Short delay to show it's off momentarily
      setTimeout(() => {
        // Toggle loading state back on and refresh data
        this.refreshLoading = true;
        this.fetchChargingStations();
      }, 200);
    }, 4000); // Total cycle is 4 seconds (2 seconds on, small break, then repeats)
  },
  
  // Make sure to clear the interval when component is destroyed
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  async fetchChargingStations() {
    this.loading = true;
    try {
      // Build filters object
      const filters = {};
      if (this.filters.status) filters.status = this.filters.status;
      if (this.filters.connectorType) filters.connectorType = this.filters.connectorType;
      if (this.filters.minPowerOutput) filters.minPowerOutput = this.filters.minPowerOutput;
      if (this.filters.maxPowerOutput) filters.maxPowerOutput = this.filters.maxPowerOutput;
      
      // Call the service
      const response = await chargingStationService.getChargingStations(filters);
      this.chargingStations = response;
      
      // If map view is active, update the markers
      if (this.viewMode === 'map' && this.map) {
        this.addMarkersToMap();
      }
    } catch (error) {
      this.showSnackbar(`Error loading charging stations: ${error.message}`, 'error');
    } finally {
      this.loading = false;
    }
  },
  logout() {
  // Clear the token and user from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Show success message
  this.showSnackbar('Logged out successfully', 'success');
  
  // Redirect to login page
  this.$router.push('/login');
},
  // Add filter toggle method
  toggleFilters() {
    this.filters.showFilters = !this.filters.showFilters;
  },
  
  // Add filter reset method
  resetFilters() {
    this.filters.status = null;
    this.filters.connectorType = null;
    this.filters.minPowerOutput = null;
    this.filters.maxPowerOutput = null;
    this.fetchChargingStations();
  },
  
  // Apply filters
  applyFilters() {
    this.fetchChargingStations();
  },
  
 
async saveStation() {
    console.log('here')
  if (this.$refs.stationForm.validate()) {
    try {
      const stationData = { ...this.dialog.station };
      
      // Remove id from request body if creating a new station
      if (!this.dialog.isEdit) {
        delete stationData.id;
      }
      const userID = JSON.parse(localStorage.getItem('user'));
      // Make sure we're only sending fields the API expects
      const payload = {
        name: stationData.name,
        latitude: parseFloat(stationData.latitude),
        longitude: parseFloat(stationData.longitude),
        status: stationData.status,
        powerOutput: parseFloat(stationData.powerOutput),
        connectorType: stationData.connectorType,
        userId:userID?.id
        
      };
      
      console.log('Saving station with payload:', payload);
      
      if (this.dialog.isEdit) {
        // Update existing station
        const stationId = this.dialog.station.id;
        console.log(`Updating station ID: ${stationId}`);
        console.log('2')
        await chargingStationService.updateChargingStation(stationId, payload);
        this.showSnackbar("Station updated successfully", "success");
      } else {
        // Create new station
        console.log('Creating new station');
        await chargingStationService.createChargingStation(payload);
        this.showSnackbar("New station added successfully", "success");
      }
      
      // Refresh the data
      this.fetchChargingStations();
      this.closeDialog();
    } catch (error) {
      console.error('API error:', error);
      this.showSnackbar(`Error saving station: ${error.response?.data?.message || error.message}`, "error");
    }
  }
},

// Fix the deleteStation method
async deleteStation() {
  try {
    const stationId = this.confirmDialog.stationId;
    console.log(`Deleting station ID: ${stationId}`);
    
    await chargingStationService.deleteChargingStation(stationId);
    this.showSnackbar("Station deleted successfully", "success");
    
    // Refresh the data
    this.fetchChargingStations();
  } catch (error) {
    console.error('API error:', error);
    this.showSnackbar(`Error deleting station: ${error.response?.data?.message || error.message}`, "error");
  }
  this.confirmDialog.show = false;
},
      // Map related methods
   
// First, we need to load the Leaflet MarkerCluster plugin
// Add these to your loadLeafletScript method

loadLeafletScript() {
  // Load Leaflet CSS
  const linkCSS = document.createElement('link');
  linkCSS.rel = 'stylesheet';
  linkCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(linkCSS);
  
  // Load MarkerCluster CSS
  const clusterCSS = document.createElement('link');
  clusterCSS.rel = 'stylesheet';
  clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
  document.head.appendChild(clusterCSS);
  
  const clusterDefaultCSS = document.createElement('link');
  clusterDefaultCSS.rel = 'stylesheet';
  clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
  document.head.appendChild(clusterDefaultCSS);
  
  // Load Leaflet JS
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = () => {
    console.log('Leaflet loaded successfully');
    
    // After Leaflet loads, load the MarkerCluster plugin
    const clusterScript = document.createElement('script');
    clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
    clusterScript.onload = () => {
      console.log('MarkerCluster plugin loaded successfully');
      if (this.viewMode === 'map') {
        setTimeout(() => {
          this.initLeafletMap();
        }, 200);
      }
    };
    document.head.appendChild(clusterScript);
  };
  document.head.appendChild(script);
}
,

initLeafletMap() {
  if (!window.L || !this.$refs.mapContainer) return;
  
  console.log('Initializing Leaflet map');
  
  // Create map
  this.map = L.map(this.$refs.mapContainer).setView([0, 0], 2);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);
  
  // Add markers for stations
  this.chargingStations.forEach(station => {
    const marker = L.marker([station.latitude, station.longitude])
      .addTo(this.map)
      .bindPopup(`
        <strong>${station.name}</strong><br>
        Status: ${station.status}<br>
        Power: ${station.powerOutput} kW<br>
        Connector: ${this.formatConnectorType(station.connectorType)}
      `);
  });
  
  // Fit bounds to markers
  if (this.chargingStations.length > 0) {
    const bounds = this.chargingStations.map(s => [s.latitude, s.longitude]);
    this.map.fitBounds(bounds);
  }
},
      
// In your component methods

initMap() {
  console.log('Initializing Leaflet map with clustering');
  
  // If map already exists, remove it first
  if (this.map) {
    this.map.remove();
    this.map = null;
  }
  
  if (!window.L || !this.$refs.mapContainer) {
    console.error('Leaflet or map container not available');
    return;
  }
  
  // Create new map
  try {
    this.map = L.map(this.$refs.mapContainer).setView([28.6139, 77.209], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    // Ensure map renders correctly
    setTimeout(() => {
      this.map.invalidateSize();
      // Add markers after ensuring map is properly sized
      this.addMarkersToMap();
    }, 100);
  } catch (error) {
    console.error('Error creating map:', error);
  }
},

addMarkersToMap() {
  // Clear existing markers if any
  if (this.markers) {
    this.markers.forEach(marker => {
      if (marker.remove) marker.remove();
    });
  }
  
  this.markers = [];
  
  // Skip if no stations
  if (this.chargingStations.length === 0) return;
  
  // Create a marker cluster group
  const markerCluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  spiderfyOnMaxZoom: true,
  removeOutsideVisibleBounds: true,
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    const size = count < 10 ? 'small' : count < 20 ? 'medium' : 'large';
    const color = count < 5 ? '#91CE5F' : count < 10 ? '#1E88E5' : count < 20 ? '#1E88E5' : '#FFCA28';
    
    // Create an SVG marker pin with the count
    const svgPin = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <g fill="none" fill-rule="evenodd">
          <path d="M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0z" fill="${color}" opacity=".9"/>
          <text fill="#FFF" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" x="20" y="25">
            ${count}
          </text>
        </g>
      </svg>
    `;
    
    // Create a div icon with the SVG
    return L.divIcon({
      html: svgPin,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40),
      iconAnchor: [20, 20]
    });
  }
});
  
  // Add a marker for each station
  const bounds = [];
  
  this.chargingStations.forEach(station => {
    // Create marker
    const marker = L.marker([station.latitude, station.longitude], {
      title: station.name
    });
    
    // Add popup with station info
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px; color: #00796B;">${station.name}</h3>
        <div style="padding: 3px 0;"><strong>Status:</strong> ${station.status}</div>
        <div style="padding: 3px 0;"><strong>Power:</strong> ${station.powerOutput} kW</div>
        <div style="padding: 3px 0;"><strong>Connector:</strong> ${this.formatConnectorType(station.connectorType)}</div>
        <div style="padding: 3px 0;"><strong>Coordinates:</strong> ${this.formatCoordinates(station.latitude, station.longitude)}</div>
        <div style="margin-top: 8px;">
          <button onclick="window.editStation('${station.id}')" 
                  style="background: #00796B; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">
            Edit
          </button>
          <button onclick="window.deleteStation('${station.id}')"
                  style="background: #F44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
            Delete
          </button>
        </div>
      </div>
    `);
    
    // Add to cluster group instead of directly to map
    markerCluster.addLayer(marker);
    
    // Store marker reference
    this.markers.push(marker);
    
    // Add to bounds
    bounds.push([station.latitude, station.longitude]);
  });
  
  // Add the cluster group to the map
  this.map.addLayer(markerCluster);
  
  // Fit map to bounds
  if (bounds.length > 0) {
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }
},

// Add these window functions for the popup buttons to work
mounted() {
  // Set up global functions for marker popups
  window.editStation = (id) => {
    const station = this.chargingStations.find(s => s.id === id);
    if (station) {
      this.openEditDialog(station);
    }
  };
  
  window.deleteStation = (id) => {
    const station = this.chargingStations.find(s => s.id === id);
    if (station) {
      this.confirmDelete(station);
    }
  };
},
      
      updateMapMarkers() {
        if (!this.map) return;
        
        const { Point } = ol.geom;
        const { Feature } = ol;
        const { Style, Icon, Text, Fill, Stroke } = ol.style;
        
        // Get vector layer
        const vectorLayer = this.map.getLayers().getArray()[1];
        const vectorSource = vectorLayer.getSource();
        
        // Clear existing markers
        vectorSource.clear();
        
        // Add markers for stations
        this.chargingStations.forEach(station => {
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
        if (this.chargingStations.length > 0) {
          const extent = vectorSource.getExtent();
          this.map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15
          });
        }
      },
      
      getMarkerIcon(status) {
        // Return marker icon URL based on status
        switch (status) {
          case 'active':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker.svg';
          case 'maintenance':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker-alert.svg';
          case 'inactive':
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker-off.svg';
          default:
            return 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker.svg';
        }
      },
      
      showStationInfo(station) {
        this.stationInfoDialog.station = { ...station };
        this.stationInfoDialog.show = true;
      },
      
      openEditFromInfo() {
        this.openEditDialog(this.stationInfoDialog.station);
        this.stationInfoDialog.show = false;
      },
      
      confirmDeleteFromInfo() {
        this.confirmDelete(this.stationInfoDialog.station);
        this.stationInfoDialog.show = false;
      },
      
      // Location picker methods
      openLocationPicker() {
        this.locationPicker.latitude = this.dialog.station.latitude || 0;
        this.locationPicker.longitude = this.dialog.station.longitude || 0;
        this.locationPicker.show = true;
        
        // Initialize map in next tick after the dialog is shown
        this.$nextTick(() => {
          this.initLocationPickerMap();
        });
      },
      
      initLocationPickerMap() {
        if (!window.ol || !this.$refs.locationMapContainer) return;
        
        const { Map, View } = ol;
        const { Tile: TileLayer, Vector: VectorLayer } = ol.layer;
        const { OSM, Vector: VectorSource } = ol.source;
        const { Style, Icon } = ol.style;
        const { Point } = ol.geom;
        const { Feature } = ol;
        
        // Create vector source for marker
        const vectorSource = new VectorSource();
        
        // Create vector layer for marker
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        
        // Create map
        this.locationPicker.map = new Map({
          target: this.$refs.locationMapContainer,
          layers: [
            new TileLayer({
              source: new OSM()
            }),
            vectorLayer
          ],
          view: new View({
            center: ol.proj.fromLonLat([
              parseFloat(this.locationPicker.longitude) || 0, 
              parseFloat(this.locationPicker.latitude) || 0
            ]),
            zoom: 12
          })
        });
        
        // Add marker
        this.updateLocationPickerMarker();
        
        // Add click interaction
        this.locationPicker.map.on('click', (event) => {
          const coords = ol.proj.toLonLat(event.coordinate);
          this.locationPicker.longitude = coords[0];
          this.locationPicker.latitude = coords[1];
          this.updateLocationPickerMarker();
        });
      },
      
      updateLocationPickerMarker() {
        if (!this.locationPicker.map) return;
        
        const { Point } = ol.geom;
        const { Feature } = ol;
        const { Style, Icon } = ol.style;
        
        // Get vector layer
        const vectorLayer = this.locationPicker.map.getLayers().getArray()[1];
        const vectorSource = vectorLayer.getSource();
        
        // Clear existing markers
        vectorSource.clear();
        
        // Add marker
        const coords = ol.proj.fromLonLat([
          parseFloat(this.locationPicker.longitude) || 0, 
          parseFloat(this.locationPicker.latitude) || 0
        ]);
        
        // Create feature
        const feature = new Feature({
          geometry: new Point(coords)
        });
        
        // Set style
        feature.setStyle(new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'https://cdn.jsdelivr.net/npm/@mdi/svg@7.2.96/svg/map-marker.svg',
            scale: 0.6
          })
        }));
        
        // Add feature to source
        vectorSource.addFeature(feature);
      },
      
      setLocationFromPicker() {
        this.dialog.station.latitude = this.locationPicker.latitude;
        this.dialog.station.longitude = this.locationPicker.longitude;
        this.locationPicker.show = false;
      },
      
      // Station CRUD methods
      openAddDialog() {
        this.dialog.isEdit = false;
        this.dialog.station = {
          id: null,
          name: "",
          latitude: null,
          longitude: null,
          status: "active",
          powerOutput: null,
          connectorType: "type2"
        };
        this.dialog.show = true;
      },
      
      openEditDialog(station) {
        this.dialog.isEdit = true;
        this.dialog.station = { ...station }; // Clone to avoid direct mutation
        this.dialog.show = true;
      },
      
      closeDialog() {
        this.dialog.show = false;
        this.$nextTick(() => {
          this.$refs.stationForm.resetValidation();
        });
      },
      
    //   saveStation() {
    //     if (this.$refs.stationForm.validate()) {
    //       if (this.dialog.isEdit) {
    //         const index = this.chargingStations.findIndex(s => s.id === this.dialog.station.id);
    //         if (index !== -1) {
    //           this.dialog.station.updatedAt = new Date().toISOString();
    //           this.chargingStations.splice(index, 1, { ...this.dialog.station });
    //           this.showSnackbar("Station updated successfully", "success");
    //         }
    //       } else {
    //         const newId = Math.max(0, ...this.chargingStations.map(s => s.id)) + 1;
    //         const now = new Date().toISOString();
    //         const newStation = {
    //           ...this.dialog.station,
    //           id: newId,
    //           userId: 1,
    //           createdAt: now,
    //           updatedAt: now
    //         };
    //         this.chargingStations.push(newStation);
    //         this.showSnackbar("New station added successfully", "success");
    //       }
    //       this.closeDialog();
    //     }
    //   },
      
      confirmDelete(station) {
        this.confirmDialog.stationId = station.id;
        this.confirmDialog.stationName = station.name;
        this.confirmDialog.show = true;
      },
      
    //   deleteStation() {
    //     const index = this.chargingStations.findIndex(s => s.id === this.confirmDialog.stationId);
    //     if (index !== -1) {
    //       this.chargingStations.splice(index, 1);
    //       this.showSnackbar("Station deleted successfully", "success");
    //     }
    //     this.confirmDialog.show = false;
    //   },
      
      showSnackbar(message, color) {
        this.snackbar.message = message;
        this.snackbar.color = color;
        this.snackbar.show = true;
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
        if (!lat || !lng) return "";
        return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
      },
      
      formatDate(dateString) {
        if (!dateString) return "";
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
  /* Container styling */
  .ev-container {
    background: linear-gradient(135deg, #00BFA5 0%, #0288D1 100%);
    min-height: 100vh;
    padding: 40px 20px;
  }
  
  /* Header styling */
  .header {
    padding: 0 10px;
    margin-bottom: 30px;
  }
  
  /* Titles */
  .ev-title {
    font-size: 2.2rem;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .ev-subtitle {
    font-size: 1.6rem;
    font-weight: 500;
    color: #00796B;
  }
  
  /* Card styling */
  .ev-card {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.98);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: none;
    min-width: 300px;

  }
  
  .ev-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  /* Station title within card */
  .ev-station-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: #00796B;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  /* Station details styling */
  .station-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 10px;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: #546e7a;
  }
  
  /* Card actions styling */
  .card-actions {
    margin-top: auto;
  }
  
  /* Dialog card styling */
  .dialog-card {
    border-radius: 12px;
  }
  
  .ev-dialog-title {
    font-size: 1.4rem;
    font-weight: 500;
    color: #00796B;
  }
  
  /* Buttons */
  .ev-button {
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.5px;
  }
  
  /* Inputs */
  .ev-input {
    margin-bottom: 16px;
  }
  
  /* Empty state */
  .empty-state {
    max-width: 500px;
    margin: 0 auto;
  }
  
  /* Map styling */
  .map-view-container {
  position: relative;
  height: 70vh; /* Already good */
  min-height: 500px; /* Add a minimum height */
  width: 100%;
}

.map-card {
  height: 100%;
  width: 100%;
}

.map {
  height: 100% !important; /* Force height */
  width: 100% !important;  /* Force width */
  min-height: 500px;       /* Minimum height */
}
  
  .empty-state-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
  }
  
  /* Location picker styling */
  .location-picker-card {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .location-picker-title {
    background-color: #00796B;
    color: white;
    padding: 16px;
  }
  
  .location-picker-content {
    padding: 16px;
  }
  
  .location-map {
    height: 400px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .location-coordinates {
    margin-top: 8px;
    font-size: 14px;
    color: #546e7a;
  }
  
  /* Station info dialog styling */
  .station-info-card {
    border-radius: 12px;
  }
  
  .station-info-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: #00796B;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

.ev-card {
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.ev-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.ev-station-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #00796B;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.station-details {
  margin-top: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.detail-item .v-icon {
  margin-right: 8px;
  color: #00796B;
}

.card-actions {
  padding: 8px 16px;
}

/* Make the status chip more visible */
.v-chip.v-size--small {
  font-size: 0.8rem;
  height: 24px;
}
.custom-cluster-icon {
  background: none;
}

/* Marker Pointer Style - similar to the second image */
.cluster-marker {
  width: 36px;
  height: 36px;
  position: relative;
}

.cluster-marker:before {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 8px solid transparent;
  border-bottom: 36px solid #1E88E5;
  border-radius: 50% 50% 0 0;
  z-index: -1;
}

.cluster-marker-count {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1E88E5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
  position: relative;
  z-index: 1;
}

/* Hover effect for clusters */
.leaflet-marker-icon:hover .cluster-marker {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Animation for the refresh button */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.v-btn.loading {
  animation: pulse 1s infinite;
}
.cluster-icon {
    position: relative;
    background-color: red;
    color: white;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }

  .cluster-icon::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid red;
  }
  </style>
