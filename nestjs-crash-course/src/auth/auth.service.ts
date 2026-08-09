import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
   signup() {
    /**
     * check if email is already exists 
     * hash password 
     * store user in db 
     * generate jwt token
     * rend token response
     */
    return {
      success:true,
      message:'User created successfully',
      data:null,
    };
  }
}
