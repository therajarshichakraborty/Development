class Router {
  constructor(routes) {
    this.routes = [];
  }

   add(method, path, handler) {
    const paramNames = [];
    const pattern = path
      .split('/')
      .filter(Boolean)
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment;
      })
      .join('/');
 
    const regex = new RegExp(`^/${pattern}/?$`);
    this.routes.push({ method, regex, paramNames, handler });
    return this;
  }

   handle(req, res, pathname) {
    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const match = pathname.match(route.regex);
      if (!match) continue;
 
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
 
      req.params = params;
      return route.handler(req, res);
    }
 
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }


  get(path, handler) {
    return this.add("GET", path, handle);
  }

  post(path, handler) {
    return this.add("POST", path, handler);
  }

  put(path, handler) {
    return this.add("PUT", path, handler);
  }

  delete(path, handler) {
    return this.add("DELETE", path, handler);
  }
}


export default Router;
