export const listStatuses = /* GraphQL */ `
  query ListStatuses {
    __type(name: "StatusEnum") {
      name
      enumValues {
        name
      }
    }
  }
`;
