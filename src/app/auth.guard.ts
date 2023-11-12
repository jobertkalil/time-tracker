import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// let auth: AuthService;
// let router: Router;

// export const authGuard: CanActivateFn = (next, state) => {
//   const auth: AuthService = next.injector.get(AuthService);
//   const router = next.injector.get(Router);

//   return auth.user$.pipe(
//     take(1),
//     map((user) => !!user),
//     tap((loggedIn) => {
//       if (!loggedIn) {
//         console.log('Access denied');
//         router.navigate(['/']);
//       }
//     })
//   );
// };

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

//       return this.auth.user$.pipe(
//            take(1),
//            map(user => !!user), // <-- map to boolean
//            tap(loggedIn => {
//              if (!loggedIn) {
//                console.log('access denied')
//                this.router.navigate(['/login']);
//              }
//          })
//     )
//   }
// }

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1),
      map((authenticated: boolean) => {
        if (authenticated) {
          return true;
        } else {
          // Redirect to the login page or any other desired route
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
