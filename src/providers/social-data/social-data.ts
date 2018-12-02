import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDataProvider } from '../auth-data/auth-data';
import { Events } from 'ionic-angular';

 
@Injectable()
export class SocialDataProvider {

  constructor(public http: HttpClient,public authData:AuthDataProvider,public events: Events) {
    console.log('Hello SocialDataProvider Provider');
  }
  updateLike(borasaArry, document_id, type, index, CollectionName) {
    var likeflag = false;
    var unLikeflag = false
    if (type == "like") {
      for (let i in this.authData.user.likes) {
        // console.log(this.authData.user.likes,"this.authData.user.likes",(this.authData.user.likes).length);
        
        if (document_id == this.authData.user.likes[i]) {
          delete this.authData.user.likes[i]
          this.authData.user.likes.splice(Number(i), 1)
          borasaArry[index].Like = false
          likeflag = true;
          borasaArry[index].likes -= 1
          this.updateServerDeleteEmotion(document_id, type, CollectionName)

        }
      }
      if (!likeflag) {

        for (let i in this.authData.user.unlikes) {
          if (document_id == this.authData.user.unlikes[i]) {
            delete this.authData.user.unlikes[i]
            this.authData.user.unlikes.splice(Number(i), 1)
            borasaArry[index].unLike = false

            unLikeflag = true
            borasaArry[index].unlikes -= 1

            this.updateServerDeleteEmotion(document_id, "unlike", CollectionName)
          }
        }
      }
      if (!likeflag) {
        borasaArry[index].Like = true

        this.authData.user.likes.push(document_id)
        
        borasaArry[index].likes += 1
     

        this.updateServerAddEmotion(document_id, "like", CollectionName)
      }
    }
    else {
      for (let i in this.authData.user.unlikes) {
        if (document_id == this.authData.user.unlikes[i]) {
          delete this.authData.user.unlikes[i]
          this.authData.user.unlikes.splice(Number(i), 1)

          borasaArry[index].unLike = false

          unLikeflag = true;
          borasaArry[index].unlikes -= 1

          this.updateServerDeleteEmotion(document_id, type, CollectionName)

        }
      }
      if (!unLikeflag) {
        this.updateServerAddEmotion(document_id, type, CollectionName)
        borasaArry[index].unlikes += 1

        for (let i in this.authData.user.likes) {
          if (document_id == this.authData.user.likes[i]) {
            delete this.authData.user.likes[i]
            this.authData.user.likes.splice(Number(i), 1)
            borasaArry[index].Like = false

            borasaArry[index].likes -= 1

            this.updateServerDeleteEmotion(document_id, "like", CollectionName)
          }
        }
        borasaArry[index].unLike = true
        this.authData.user.unlikes.push(document_id)

      }
    }
  }
  updateServerDeleteEmotion(document_id, type, CollectionName) {
    console.log(document_id, type, CollectionName);
    
    var data = {
      userId: this.authData.user._id,
      product_id: document_id,
      type: type,
      CollectionName: CollectionName
    }
    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/deleteEmotion", data)
      .toPromise()
      .then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);

      })
  }
  updateServerAddEmotion(document_id, type, CollectionName) {
    var data = {
      userId: this.authData.user._id,
      product_id: document_id,
      type: type,
      CollectionName: CollectionName
    }
    console.log(data,"data");

    this.http.post("http://afternoon-mountain-15657.herokuapp.com/api/addEmotion", data)
      .toPromise()
      .then((data) => {
        console.log(data);

      }).catch((err) => {
        console.log(err);

      })
  }
 
  checkLike(borasaArry){
    for (let i in this.authData.user.likes) 
      if (borasaArry._id == this.authData.user.likes[i])
        borasaArry.Like = true;    
  }
  checkunLike(borasaArry){
    for (let i in this.authData.user.likes) 
    if (borasaArry._id == this.authData.user.unlikes[i])
      borasaArry.unLike = true;    
  }
    checkLike2(borasaArry) {
      for (let j in borasaArry) {
        for (let i in this.authData.user.likes) {
          if (borasaArry[j]._id == this.authData.user.likes[i])
            borasaArry[j].Like = true;
  
  
        }
      }
    }
    checkUnlike2(borasaArry) {
      console.log(borasaArry);
      
      for (let j in borasaArry) {
        for (let i in this.authData.user.unlikes) {
  console.log(borasaArry[j]._id == this.authData.user.unlikes[i]);
  
          if (borasaArry[j]._id == this.authData.user.unlikes[i])
            borasaArry[j].unLike = true;
  
  
        }
      }
  }
  
  
  

  
}
