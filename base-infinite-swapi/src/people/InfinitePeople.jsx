import InfiniteScroll from 'react-infinite-scroller';
import { Person } from './Person';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.py4e.com/api/people/';
const fetchUrl = async url => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ['sw-people'],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: lastPage => lastPage.next || undefined,
    });
  console.log('🚀 ~ InfinitePeople ~ data:', data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;
  return (
    <>
      {isFetching && <div className="loading">Fetching...</div>}
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
      >
        {data.pages.map(pageData => {
          return pageData.results.map(person => (
            <Person
              key={person.name}
              name={person.name}
              eyeColor={person.eye_color}
              hairColor={person.hair_color}
            ></Person>
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
