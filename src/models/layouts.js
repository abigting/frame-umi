export default {
  namespace: 'layout',
  state: {
    routers:[],
  },
  reducers: {
    update(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
  },
}

