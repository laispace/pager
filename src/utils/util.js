export function forceUpdate(component) {
  // This is a hack :)
  // be carefore using it!
  console.log('by reset state to rerender page, a link will be cancle!');
  component.setState({
    forceRerenderTimstramp: window.performance && window.performance.now && window.performance.now() || Date.now()
  });
}

export default {forceUpdate};


