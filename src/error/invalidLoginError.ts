import { AuthError } from "next-auth";

export default class InvalidLoginError extends AuthError {
  code = "custom";
  errorMessage;

  constructor(message : string) {
    super(message);
    this.errorMessage = message;
  }
}
