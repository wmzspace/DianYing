import HomeView from '@/views/HomeView.vue'

const CATEGORIES = {
  path: '/channel/:channelName',
  name: 'Channel',
  meta: {
    layout: 'a'
  },
  component: HomeView
}

export default CATEGORIES
