import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login-success',
    templateUrl: './login-success.component.html',
    styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {

    constructor(private http: HttpClient,
                private router: Router) {
    }

    ngOnInit(): void {
        this.http.get('http://localhost:8080/userGg', {withCredentials: true}).subscribe(userId => {
            localStorage.setItem("userPresentId", userId.toString());
            this.router.navigateByUrl('newsFeed').then(() => location.reload());
        });
    }

}
