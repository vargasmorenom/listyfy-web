import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class HomeReuseStrategy implements RouteReuseStrategy {
  private cache = new Map<string, DetachedRouteHandle>();

  /** Solo cachear rutas marcadas con data: { reuse: true } */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data['reuse'];
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) this.cache.set(route.routeConfig?.path ?? '', handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.data['reuse'] && this.cache.has(route.routeConfig?.path ?? '');
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.cache.get(route.routeConfig?.path ?? '') ?? null;
  }

  /** Misma lógica que IonicRouteStrategy: reusar si mismo config y mismos params */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.routeConfig !== curr.routeConfig) return false;
    const fp = future.params;
    const cp = curr.params;
    const keys = Object.keys(fp);
    if (keys.length !== Object.keys(cp).length) return false;
    return keys.every(k => fp[k] === cp[k]);
  }
}
