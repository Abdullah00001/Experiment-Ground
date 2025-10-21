import { writeFileSync } from "fs";
import { stringify } from "csv-stringify/sync";

// CSV Template
const csvHeaders = [
  "firstName",
  "lastName",
  "email",
  "phoneCountryCode",
  "phoneNumber",
  "birthdayDate",
  "birthdayMonth",
  "birthdayYear",
  "addressStreet",
  "addressCity",
  "addressCountry",
  "addressPostCode",
  "organizationName",
  "organizationPosition",
];

const csvExampleRow = [
  "John",
  "Doe",
  "john.doe@example.com",
  "+1",
  "1234567890",
  15,
  4,
  1990,
  "123 Main St",
  "New York",
  "USA",
  "10001",
  "Acme Corp",
  "Software Engineer",
];

const csvData = stringify([csvHeaders, csvExampleRow]);
writeFileSync("contacts_template.csv", csvData);
