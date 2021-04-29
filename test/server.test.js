let server = require("../src/server");
let chai = require("chai");

let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp); 
const { expect } = chai;
var assert = chai.assert;


//Import complete
//Positive Test Case: In a positive test case, the API's are tested by providing valid arguments/parameters as input. Write a positive test case for each of the API's defined above.
//Negative Test Case: In a negative test case, the API's are tested by providing invalid arguments/parameters as input and test if it returns error as response. Write a negative test case for each of the API's defined above.

describe("Server!", () => {
  //test for main page
  it("Welcome to main page!", done => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test for reviews page
  it("This is the Reviews Page", done => {
    chai
      .request(server)
      .get("/reviews")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test for add review
  it("Could not add a review...", done => {
    chai
      .request(server)
      .post("/main/add_review")
      .send({ today: new Date(), movie_title: 'Saw', review: 'Scary Movie!'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test for get_feed
  it("Getting your movie...", done => {
    chai
      .request(server)
      .post("/get_feed")
      .send({ title: 'Saw'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test for checking review search
  it("Checking review search for movie not in database...", done => {
    chai
      .request(server)
      .post("/reviews/filter")
      .send({ movie_title: 'The Avengers'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

})