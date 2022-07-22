import faker from "faker";

var randomName = faker.mea.seed_array();
var randomName2 = faker.name.jobDescriptor();
var randomName3 = faker.name.jobArea();
var randomName4 = faker.name.jobType();
console.log("randomName= ", randomName);
console.log("randomName2= ", randomName2);
console.log("randomName3= ", randomName3);
console.log("randomName4= ", randomName4);
