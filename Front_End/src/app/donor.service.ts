import { Injectable } from '@angular/core';
import {Donordata} from 'Models/donordata.model'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DonorService {
  donor:Donordata;
  donor_id:number;
  flg:boolean;
  toset:boolean;
  donated:string;
  constructor(private http:HttpClient) { }

  private getalldonorsURL='http://localhost:3000/donor/getalldonors';
  private donorsignupURL = 'http://localhost:3000/donor/signup';
  private donorsigninURL='http://localhost:3000/donor/signin';
  private delparticulardonorURL='http://localhost:3000/donor/delete';
  private recoverpassURL='http://localhost:3000/donor/recoverpass';
  private deletebypermissionURL ='http://localhost:3000/donor/deletebypermission';
  private sendEmailPostMarkURL = 'http://localhost:3000/donor/sendemail';

  getDonors()
  {
    return this.http.get(this.getalldonorsURL);
  }


  //to submit data when donor fill signup form
  postDonor(donor:Donordata)
  {
    return this.http.post(this.donorsignupURL,donor)
  }

  //to verify donor while signin
  checkDonor(donor:Donordata)
  {
    return this.http.post(this.donorsigninURL,donor)
  }

  //to delete donor
  deleteDonor(donor:Donordata)
  {
    console.log(donor)
    return this.http.post(this.delparticulardonorURL,donor);

  }

  //delete by permission of donor
  deleteByPermission(donor:Donordata)
  {
    return this.http.post(this.deletebypermissionURL,donor);
  }


  sendEmail(donor:Donordata)
  {
    console.log('inside donor service')
      return this.http.post('http://localhost:3000/donor/sendemail',donor)
  }

  //to recover password
  recoverPass(donor:Donordata)
  {
    console.log('inside reocver service')
    console.log(donor);
    return this.http.post(this.recoverpassURL,donor)
  }
  isdonated()
  {
    console.log(sessionStorage.getItem('id'));
    this.donated = sessionStorage.getItem('id');
    if (this.donated=='no') {

      return false;
    }
    else {

      return true;

    }
  }

  sendEmailThroughPostMark(donor:Donordata) : Observable<any>{
    console.log('get donor data',donor)
    const apiUrl = "https://api.postmarkapp.com/email"
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': '2a10a0b9-d204-45bc-9d4d-b9fd1b9a3458'
    });
    // const emailData = {
    //   From: 'sm1020@srmist.edu.in', // Replace with sender's email
    //   To: 'sm1020@srmist.edu.in', // Replace with receiver's email
    //   Subject: 'Postmark Test',
    //   TextBody: 'Hello dear Postmark user.',
    //   HtmlBody: '<html><body><strong>Hello</strong> dear Postmark user.</body></html>',
    //   MessageStream: 'outbound',
    // };
    const emailData = {
      "From": "sm1020@srmist.edu.in",
      "To": donor.address,
      "Subject": "Gather Give",
      "Tag": "Invitation",
      "HtmlBody": "<p>Hi,</p><p>I hope you're doing well!</p><p>At <b>Gather & Give</b>, we believe that no food should go to waste when so many are in need. Our <b>Gather & Give</b> initiative aims to collect surplus food and essential products from generous donors like you and distribute them to communities in need.</p><p>Best regards,<br>Shankar Ganesh</p>",
      "TextBody": "Hi,\n\nI hope you're doing well!\n\nAt Gather & Give, we believe that no food should go to waste when so many are in need. Our Gather & Give initiative aims to collect surplus food and essential products from generous donors like you and distribute them to communities in need.\n\nBest regards,\nShankar Ganesh",

      // "HtmlBody": "<b>Hello</b>",
      // "TextBody": "Hello",
      "ReplyTo": "shankarganesh07@gmail.com",
      "Metadata": {
          "Color":"blue",
          "Client-Id":"12345"
      },
      "TrackOpens": true,
      "TrackLinks": "HtmlOnly",
      "MessageStream": "outbound"
    }
    //console.log('got email data',emailData)

    return this.http.post(this.sendEmailPostMarkURL,emailData)
  }

}
