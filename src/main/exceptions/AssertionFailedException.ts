import { error } from '../helpers/LogHelper';

export default class AssertionFailedException extends Error{

  constructor(message: string, originatingException: Error) {
    error(message + "\n" + originatingException.message.split("Call log:")[0])
    super(message + "\n" + originatingException.stack);
  }
}