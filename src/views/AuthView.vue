<template>
  <div class="auth-page">
    <h2>Увійти / Зареєструватися</h2>
    <div class="providers">
      <button @click="google()">Sign in with Google</button>
      <button @click="facebook()">Sign in with Facebook</button>
    </div>

    <hr />

    <div class="email-auth">
      <h3>Sign in with email</h3>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <div>
        <button @click="login">Login</button>
        <button @click="register">Register</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useUser from '../stores/user'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const u = useUser()

    async function google() {
      await u.signInWithGoogle()
      router.push('/profile')
    }

    async function facebook() {
      await u.signInWithFacebook()
      router.push('/profile')
    }

    async function login() {
      await u.loginWithEmail(email.value, password.value)
      router.push('/profile')
    }

    async function register() {
      await u.registerWithEmail(email.value, password.value)
      router.push('/profile')
    }

    return { email, password, google, facebook, login, register }
  },
}
</script>

<style scoped>
.auth-page { max-width: 480px; margin: 20px auto; }
.providers button { margin-right: 8px }
input { display:block; margin:8px 0; padding:8px; width:100% }
</style>
