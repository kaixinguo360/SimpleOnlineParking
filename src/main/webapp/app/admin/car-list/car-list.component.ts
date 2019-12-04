import {Component, OnInit} from '@angular/core';

import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';

import {User, UserService} from '../../service/user.service';
import {ParkService} from '../../service/park.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  public users: User[] = [];
  
  public remove(user: User) {
    if (confirm(`您确定要删除用户"${user.name}"吗?`)) {
      this.userService.remove(user.id).pipe(
        tap(() => this.syncUsers()),
        catchError(err => {
          alert("删除用户时出错!");
          return of(err);
        })
      ).subscribe();
    }
  }

  public syncUsers() {
    this.userService.getAllParked().pipe(
      tap(students => this.users = students),
      catchError(err => {
        alert("获取用户列表出错, 请稍后刷新重试!");
        return of(err);
      })
    ).subscribe();
  }

  constructor(
    private userService: UserService,
    public parkService: ParkService
  ) { }

  ngOnInit() {
    this.syncUsers();
  }

}
