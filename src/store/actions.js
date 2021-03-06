import { getCollaborator, getCollaborators } from '@/api/collaborator-api'
import { getSubjects, getSubject } from '@/api/subject-api'
import { getChannels } from '@/api/channel-api'
import { getCategory, getCategories } from '@/api/category-api'
import { authenticate, authenticateWithGoogle } from '@/api/auth-api'
import { goHome, goToLogin } from '@/config/router'
import * as types from './types'

export function refreshCollaborator ({commit}) {
  return getCollaborator()
    .then(({data}) => commit(types.REFRESH_COLLABORATOR, data))
}

export function refreshCollaborators ({commit}) {
  return getCollaborators()
    .then(({data}) => commit(types.REFRESH_COLLABORATORS, data))
}

export function refreshSubjects ({commit}) {
  return getSubjects()
    .then(({data}) => commit(types.REFRESH_SUBJECTS, data))
}

export function refreshCurrentSubject ({commit}, subjectId) {
  return getSubject(subjectId)
    .then(({data}) => {
      if (!data.isVoted && !data.isClosed) {
        data.propositions.forEach(proposal => { proposal.points = 0 })
      } else {
        data.propositions.sort((proposalA, proposalB) => proposalB.points - proposalA.points)
        data.maxPoints = data.propositions.reduce((sum, proposal) => 0 + sum + proposal.points || 0, 0) || 1
      }
      commit(types.REFRESH_CURRENT_SUBJECT, data)
    })
}

export function refreshCurrentCategory ({commit}, categoryId) {
  return getCategory(categoryId)
    .then(({data}) => commit(types.REFRESH_CURRENT_CATEGORY, data))
}

export function refreshCategories ({commit}) {
  return getCategories()
    .then(({data}) => commit(types.REFRESH_CATEGORIES, data))
}

export function refreshChannels ({commit}) {
  return getChannels()
    .then(({data}) => commit(types.REFRESH_CHANNELS, data))
}

export function filterCategory ({commit}, category) {
  return category ? commit(types.FILTER_CATEGORY, category) : null
}

export function filterChannel ({commit}, channel) {
  return channel ? commit(types.FILTER_CHANNEL, channel) : null
}

export function filterSubjectType ({commit}, subjectType) {
  return subjectType ? commit(types.FILTER_SUBJECT_TYPE, subjectType) : null
}

export function removeFilter ({commit}) {
  return commit(types.REMOVE_FILTER)
}

export function login ({dispatch}, form) {
  return authenticate(form)
    .then(() => dispatch('refreshCollaborator'))
    .then(() => goHome())
}

export function loginWithGoogle ({dispatch}) {
  return authenticateWithGoogle()
    .then(() => dispatch('refreshCollaborator'))
    .then(() => goHome())
}

export function logout ({dispatch}) {
  return dispatch('refreshCollaborator')
    .then(() => goToLogin())
}

export function showNotification ({commit}, notification) {
  return commit(types.SHOW_NOTIFICATION, notification)
}

export function hideNotification ({commit}, notification) {
  return commit(types.HIDE_NOTIFICATION, notification)
}

export function keepNotification ({commit}, notification) {
  clearTimeout(notification.timeout)
}

export function hideNotificationAfterDelay ({dispatch}, notification) {
  return new Promise((resolve, reject) => {
    notification.timeout = setTimeout(resolve, 3000)
  }).then(() => dispatch('hideNotification', notification))
}

export function notify ({dispatch}, notification) {
  return dispatch('showNotification', notification)
    .then(() => dispatch('hideNotificationAfterDelay', notification))
}
