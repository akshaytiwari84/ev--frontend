<template>
    <v-container class="fill-height ev-background" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card 
            elevation="15" 
            class="pa-6 ev-card" 
            shaped
          >
            <div class="logo-container">
              <v-img 
                src="/ev-logo.png" 
                max-height="70" 
                max-width="70" 
                contain
                class="mx-auto mb-4 pulse-animation"
              ></v-img>
              <div class="charging-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            
            <!-- Login Form -->
            <div v-if="showLoginForm">
              <v-card-title class="text-center ev-title slide-in-animation">
                ChargeHub Login
              </v-card-title>
              
              <v-card-subtitle class="text-center ev-subtitle fade-in-animation">
                Power up your EV experience
              </v-card-subtitle>
  
              <v-card-text>
                <v-form ref="loginForm" v-model="isLoginFormValid" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    required
                    prepend-inner-icon="mdi-email"
                    autocomplete="email"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': email.length > 0}"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    required
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="current-password"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': password.length > 0}"
                  ></v-text-field>
                  
                  <v-checkbox
                    v-model="rememberMe"
                    label="Keep me charged in"
                    class="mt-2 ev-checkbox fade-in-animation"
                    color="teal"
                  ></v-checkbox>
                </v-form>
              </v-card-text>
  
              <v-card-actions class="pt-0">
                <v-btn
                  :disabled="!isLoginFormValid || loading"
                  color="teal"
                  block
                  large
                  @click="login"
                  class="mt-4 ev-button"
                  elevation="3"
                >
                  <div class="button-content" v-if="!loading">
                    <v-icon left class="charging-icon">mdi-ev-station</v-icon>
                    <span>Start Charging</span>
                    <div class="battery-indicator" :class="{'battery-charging': isLoginFormValid && !loading}">
                      <div class="battery-level"></div>
                    </div>
                  </div>
                  <div class="charger-animation" v-else>
                    <div class="ev-charger">
                      <div class="charger-base"></div>
                      <div class="charger-cable"></div>
                      <div class="charger-plug"></div>
                      <div class="charger-port"></div>
                    </div>
                    <span class="charging-text">Connecting...</span>
                  </div>
                </v-btn>
              </v-card-actions>
  
              <v-card-text class="text-center mt-4">
                <a href="#" class="ev-link hover-effect" @click.prevent>Forgot your power key?</a>
                <div class="signup-prompt fade-in-animation">
                  <p>New to ChargeHub? <a href="#" class="ev-link hover-effect" @click="toggleForms">Plug in here</a></p>
                </div>
              </v-card-text>
            </div>
            
            <!-- Signup Form -->
            <div v-else class="signup-form-container slide-in-animation">
              <v-card-title class="text-center ev-title">
                Join ChargeHub
              </v-card-title>
              
              <v-card-subtitle class="text-center ev-subtitle fade-in-animation">
                Create your account to get charged up
              </v-card-subtitle>
              
              <v-card-text>
                <v-form ref="signupForm" v-model="isSignupFormValid" lazy-validation>
                  <v-text-field
                    v-model="signupData.name"
                    :rules="nameRules"
                    label="Full Name"
                    required
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': signupData.name.length > 0}"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="signupData.email"
                    :rules="emailRules"
                    label="Email"
                    required
                    prepend-inner-icon="mdi-email"
                    autocomplete="email"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': signupData.email.length > 0}"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="signupData.password"
                    :rules="passwordRules"
                    label="Password"
                    required
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': signupData.password.length > 0}"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="signupData.confirmPassword"
                    :rules="[...passwordRules, passwordMatch]"
                    label="Confirm Password"
                    required
                    prepend-inner-icon="mdi-lock-check"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense
                    class="ev-input field-animation"
                    color="teal"
                    :class="{'filled-input': signupData.confirmPassword.length > 0}"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              
              <v-card-actions class="pt-0">
                <v-btn
                  :disabled="!isSignupFormValid || loading"
                  color="teal"
                  block
                  large
                  @click="signup"
                  class="mt-4 ev-button"
                  elevation="3"
                >
                  <div class="button-content" v-if="!loading">
                    <v-icon left>mdi-account-plus</v-icon>
                    <span>Create Account</span>
                  </div>
                  <div class="charger-animation" v-else>
                    <div class="ev-charger">
                      <div class="charger-base"></div>
                      <div class="charger-cable"></div>
                      <div class="charger-plug"></div>
                      <div class="charger-port"></div>
                    </div>
                    <span class="charging-text">Connecting...</span>
                  </div>
                </v-btn>
              </v-card-actions>
              
              <v-card-text class="text-center mt-4">
                <div class="login-prompt fade-in-animation">
                  <p>Already have an account? <a href="#" class="ev-link hover-effect" @click="toggleForms">Log in here</a></p>
                </div>
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
  
      <v-snackbar
        v-model="showError"
        :color="errorMessage.includes('Successfully') ? 'teal darken-1' : 'red darken-2'"
        timeout="5000"
        elevation="24"
        shaped
        top
      >
        <div class="d-flex align-center">
          <v-icon v-if="errorMessage.includes('Successfully')" class="mr-2">
            mdi-check-circle
          </v-icon>
          <v-icon v-else class="mr-2">
            mdi-alert-circle
          </v-icon>
          {{ errorMessage }}
        </div>
        <template v-slot:actions>
          <v-btn
            color="white"
            text
            @click="showError = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  export default {
    name: 'EVAuthView',
    setup() {
      const router = useRouter()
      
      // Shared data
      const email = ref('')
      const password = ref('')
      const showPassword = ref(false)
      const loading = ref(false)
      const showError = ref(false)
      const errorMessage = ref('')
      
      // Login form data
      const rememberMe = ref(false)
      const isLoginFormValid = ref(false)
      const loginForm = ref(null)
      
      // Signup form data
      const showLoginForm = ref(true)
      const isSignupFormValid = ref(false)
      const signupForm = ref(null)
      const signupData = ref({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      
      // Validation rules
      const nameRules = [
        v => !!v || 'Name is required',
        v => v.length >= 2 || 'Name must be at least 2 characters'
      ]
      
      const emailRules = [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
      
      const passwordRules = [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ]
      
      const passwordMatch = computed(() => {
        return signupData.value.password === signupData.value.confirmPassword || 'Passwords do not match'
      })
      
      // Check if user is already authenticated
      onMounted(() => {
        const token = localStorage.getItem('token')
        if (token) {
          router.push('/chargers')
        }
      })
      
      // Methods
      const toggleForms = () => {
        showLoginForm.value = !showLoginForm.value
        
        // Reset forms when switching
        if (showLoginForm.value) {
          email.value = ''
          password.value = ''
          if (loginForm.value) loginForm.value.resetValidation()
        } else {
          signupData.value = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          }
          if (signupForm.value) signupForm.value.resetValidation()
        }
      }
      
      const login = () => {
        if (loginForm.value.validate()) {
          loading.value = true
          
          // Simulate charger plugging in animation
          setTimeout(() => {
            // API call using Axios
            axios.post('https://ev-charging-stations-backend.onrender.com/auth/login', {
              email: email.value,
              password: password.value
            })
            .then(response => {
              const data = response.data
              
              // Store token in localStorage
              if (data.token) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data))
                
                // Show success message
                errorMessage.value = 'Successfully connected! Redirecting to your dashboard...'
                showError.value = true
                
                // Redirect after a short delay
                setTimeout(() => {
                  router.push('/chargers')
                }, 1000)
              }
            })
            .catch(error => {
              errorMessage.value = error.response?.data?.message || 'Charging connection failed. Please try again.'
              showError.value = true
            })
            .finally(() => {
              loading.value = false
            })
          }, 2000) // Animation delay
        }
      }
      
      const signup = () => {
        if (signupForm.value.validate()) {
          loading.value = true
          
          // Simulate signup process with animation
          setTimeout(() => {
            // API call using Axios
            axios.post('https://ev-charging-stations-backend.onrender.com/auth/register', {
              name: signupData.value.name,
              email: signupData.value.email,
              password: signupData.value.password,
              role: 'user' // Default role
            })
            .then(() => {
              // Show successful signup message
              errorMessage.value = 'Successfully signed up! You can now log in.'
              showError.value = true
              
              // Switch back to login form
              setTimeout(() => {
                toggleForms()
                loading.value = false
              }, 1500)
            })
            .catch(error => {
              errorMessage.value = error.response?.data?.message || 'Signup failed. Please try again.'
              showError.value = true
              loading.value = false
            })
          }, 2000)
        }
      }
      
      return {
        // Shared data
        email,
        password,
        showPassword,
        loading,
        showError,
        errorMessage,
        
        // Login form data
        rememberMe,
        isLoginFormValid,
        loginForm,
        
        // Signup form data
        showLoginForm,
        isSignupFormValid,
        signupForm,
        signupData,
        
        // Validation rules
        nameRules,
        emailRules,
        passwordRules,
        passwordMatch,
        
        // Methods
        toggleForms,
        login,
        signup
      }
    }
  }
  </script>
  
  
  <style scoped>
  .ev-background {
    background: linear-gradient(135deg, #00bfa5 0%, #0288d1 100%);
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  /* Background pattern with subtle EV theme */
  .ev-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.1"><path d="M10 50 L30 70 L50 50 L70 70 L90 50" stroke="white" stroke-width="5" fill="none"/></svg>');
    background-repeat: repeat;
  }
  
  .ev-card {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
  }
  
  .ev-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  /* Card corner electric accents */
  .ev-card::before, .ev-card::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 191, 165, 0.1);
    z-index: 0;
  }
  
  .ev-card::before {
    top: -20px;
    left: -20px;
    animation: pulse 3s infinite;
  }
  
  .ev-card::after {
    bottom: -20px;
    right: -20px;
    animation: pulse 3s infinite 1.5s;
  }
  
  .logo-container {
    text-align: center;
    position: relative;
  }
  
  /* Pulse animation for logo */
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      filter: drop-shadow(0 0 0px rgba(0, 191, 165, 0.7));
    }
    50% {
      transform: scale(1.05);
      filter: drop-shadow(0 0 8px rgba(0, 191, 165, 0.9));
    }
    100% {
      transform: scale(1);
      filter: drop-shadow(0 0 0px rgba(0, 191, 165, 0.7));
    }
  }
  
  /* Charging dots animation */
  .charging-dots {
    display: flex;
    justify-content: center;
    margin-top: -15px;
    margin-bottom: 15px;
  }
  
  .charging-dots span {
    width: 6px;
    height: 6px;
    margin: 0 3px;
    border-radius: 50%;
    background-color: #00bfa5;
    animation: dots 1.4s infinite;
    opacity: 0;
  }
  
  .charging-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .charging-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  .charging-dots span:nth-child(4) {
    animation-delay: 0.6s;
  }
  
  .charging-dots span:nth-child(5) {
    animation-delay: 0.8s;
  }
  
  @keyframes dots {
    0%, 100% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .ev-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #00695c;
    letter-spacing: 1px;
    position: relative;
    z-index: 1;
  }
  
  /* Slide in animation for title */
  .slide-in-animation {
    animation: slideIn 0.7s ease-out forwards;
  }
  
  @keyframes slideIn {
    0% {
      transform: translateX(-50px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .ev-subtitle {
    color: #0288d1;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  /* Fade in animation */
  .fade-in-animation {
    animation: fadeIn 1s ease-out forwards;
    animation-delay: 0.3s;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  .ev-input {
    border-radius: 10px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
  }
  
  .ev-input:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 191, 165, 0.2);
  }
  
  /* Field animation */
  .field-animation {
    animation: fieldAppear 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .field-animation:nth-child(1) {
    animation-delay: 0.5s;
  }
  
  .field-animation:nth-child(2) {
    animation-delay: 0.7s;
  }
  
  @keyframes fieldAppear {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Style for filled inputs */
  .filled-input {
    background: rgba(0, 191, 165, 0.05);
    border-color: #00bfa5;
  }
  
  .ev-checkbox {
    margin-left: 8px;
    color: #00695c;
  }
  
  .ev-button {
    border-radius: 30px;
    text-transform: none;
    font-weight: 600;
    letter-spacing: 1px;
    background: linear-gradient(45deg, #00bfa5, #0288d1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    min-height: 50px;
  }
  
  .ev-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 191, 165, 0.4);
  }
  
  .ev-button:disabled {
    opacity: 0.7;
    background: linear-gradient(45deg, #9e9e9e, #757575);
  }
  
  /* Button ripple effect */
  .ev-button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  .ev-button:not(:disabled):hover::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(100, 100);
      opacity: 0;
    }
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  /* Charging icon animation */
  .charging-icon {
    animation: flash 2s infinite;
    margin-right: 8px;
  }
  
  @keyframes flash {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  /* Battery indicator */
  .battery-indicator {
    position: relative;
    width: 22px;
    height: 12px;
    border: 2px solid white;
    border-radius: 3px;
    margin-left: 12px;
    overflow: hidden;
  }
  
  .battery-indicator::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 3px;
    width: 3px;
    height: 6px;
    background: white;
    border-radius: 0 2px 2px 0;
  }
  
  .battery-level {
    height: 100%;
    width: 0%;
    background: white;
    transition: width 0.3s ease;
  }
  
  .battery-charging .battery-level {
    animation: chargeBattery 2s infinite;
  }
  
  @keyframes chargeBattery {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }
  
  /* Charger plugging in animation */
  .charger-animation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .charging-text {
    margin-left: 12px;
    font-weight: 500;
    color: white;
  }
  
  .ev-charger {
    position: relative;
    width: 50px;
    height: 30px;
    margin-right: 8px;
  }
  
  .charger-base {
    position: absolute;
    left: 0;
    top: 12px;
    width: 15px;
    height: 15px;
    background: white;
    border-radius: 2px;
  }
  
  .charger-cable {
    position: absolute;
    left: 15px;
    top: 18px;
    height: 3px;
    background: white;
    width: 15px;
    animation: cableExtend 1.5s infinite;
  }
  
  .charger-plug {
    position: absolute;
    left: 30px;
    top: 13px;
    width: 8px;
    height: 13px;
    background: white;
    border-radius: 2px;
    animation: plugMove 1.5s infinite;
  }
  
  .charger-port {
    position: absolute;
    right: 0;
    top: 13px;
    width: 10px;
    height: 13px;
    border: 2px solid white;
    border-radius: 2px;
    animation: portPulse 1.5s infinite;
  }
  
  @keyframes cableExtend {
    0%, 30% {
      width: 15px;
    }
    70%, 100% {
      width: 20px;
    }
  }
  
  @keyframes plugMove {
    0%, 30% {
      left: 30px;
    }
    70%, 100% {
      left: 35px;
    }
  }
  
  @keyframes portPulse {
    0%, 30% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
    }
    70% {
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
  
  .ev-link {
    color: #0288d1;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .ev-link:hover {
    color: #00695c;
  }
  
  /* Hover effect for links */
  .hover-effect {
    position: relative;
    display: inline-block;
  }
  
  .hover-effect::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #00bfa5;
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }
  
  .hover-effect:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  
  .signup-prompt, .login-prompt {
    margin-top: 12px;
    font-size: 0.9rem;
    color: #607d8b;
  }
  
  /* Animation for card entrance */
  @keyframes chargeUp {
    0% {
      transform: translateY(50px);
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .v-card {
    animation: chargeUp 0.8s ease-out;
  }
  
  /* Removed animations for signup form transition */
  
  /* Simple animation for signup form */
  </style>