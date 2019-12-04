import {Component, OnInit} from '@angular/core';
import {User, UserService} from '../../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  public user: User = {
    id: 0,
    name: '',
    car: '',
    tel: '',
    parked: false,
    credit: 0,
    passwd: '',
  };
  
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    const name = this.authService.getUserName();
    this.userService.getByName(name).pipe(
      tap(students => this.user = students),
      catchError(err => {
        alert("获取用户信息出错, 请稍后刷新重试!");
        return of(err);
      })
    ).subscribe();
  }

}
