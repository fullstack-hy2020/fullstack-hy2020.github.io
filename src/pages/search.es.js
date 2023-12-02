import React from 'react';
import { graphql } from 'gatsby';

import SearchPage from '../components/SearchPage';

const Search = ({ data }) => (
  <SearchPage
    localSearch={data.localSearchSpanish}
    title="Buscar en el material"
    inputPlaceholder="Introduce un término de búsqueda"
    lang="es"
  />
);

export default Search;

export const pageQuery = graphql`
  query {
    localSearchSpanish {
      store
      index
    }
  }
`;
