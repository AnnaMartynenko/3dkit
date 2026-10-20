import { reactive, readonly } from 'vue'
import {
  auth,
  googleProvider,
  facebookProvider,
} from '../firebase'
import {
  signInWithPopup,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'

const state = reactive({
  user: null,
  profile: {
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
    deliveryAddress: '',
    novaPoshtaAddress: '',
  },
  orders: [],
})

function setUser(u) {
  state.user = u
  if (u && u.email) state.profile.email = u.email
}

export async function signInWithGoogle() {
  const res = await signInWithPopup(auth, googleProvider)
  setUser(res.user)
  return res.user
}

export async function signInWithFacebook() {
  const res = await signInWithPopup(auth, facebookProvider)
  setUser(res.user)
  return res.user
}

export async function registerWithEmail(email, password) {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  setUser(res.user)
  return res.user
}

export async function loginWithEmail(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password)
  setUser(res.user)
  return res.user
}

export async function signOut() {
  await fbSignOut(auth)
  setUser(null)
}

export function isAdmin() {
  return !!(state.user && state.user.email === 'noparsley@gmail.com')
}

// mock orders loader - in real app fetch from backend
export function loadOrders() {
  const saved = localStorage.getItem('orders_' + (state.user?.uid || 'guest'))
  state.orders = saved ? JSON.parse(saved) : []
}

export function saveOrder(order) {
  state.orders.push(order)
  localStorage.setItem('orders_' + (state.user?.uid || 'guest'), JSON.stringify(state.orders))
}

onAuthStateChanged(auth, (u) => setUser(u))

export const userState = readonly(state)

export default function useUser() {
  return {
    userState,
    signInWithGoogle,
    signInWithFacebook,
    registerWithEmail,
    loginWithEmail,
    signOut,
    isAdmin,
    loadOrders,
    saveOrder,
  }
}
