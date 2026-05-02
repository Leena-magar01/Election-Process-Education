import "@testing-library/jest-dom";
import "@testing-library/jest-dom";

if (!global.Response) {
  global.Response = class Response {
    constructor(public body: any, public init?: any) {}
    static json(body: any, init?: any) {
      return new Response(body, init);
    }
    async json() {
      return this.body;
    }
    get status() {
      return this.init?.status || 200;
    }
  } as any;
}
