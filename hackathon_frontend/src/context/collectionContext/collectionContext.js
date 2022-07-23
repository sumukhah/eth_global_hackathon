import React, { useContext, useState } from "react";

const collectionContext = React.createContext({
  collectionData: {},
  setCollectionData: () => {},
});
export default collectionContext;
