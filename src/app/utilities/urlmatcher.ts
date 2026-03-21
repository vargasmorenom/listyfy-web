import { UrlSegment, UrlMatchResult } from '@angular/router';
import { sumarTiempo } from './sumarTiempo';

export function urlMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 4) {
    // if (segments.length === 4 && sumarTiempo(0) < segments[1])
    return {
      consumed: segments,
      posParams: {
        val: segments[1],
        id: segments[2],
        user: segments[3],
      },
    };
  }
  return null;
}
