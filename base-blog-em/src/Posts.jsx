import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPosts, deletePost, updatePost } from './api';
import { PostDetail } from './PostDetail';
const maxPostPage = 10;

export function Posts() {
  const queryclient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: postId => deletePost(postId),
  });

  const { data, isLoading, isFetching, isError, error, isRefetching } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 5000,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    const nextPage = currentPage + 1;
    queryclient.prefetchQuery({
      queryKey: ['posts', nextPage],
      queryFn: () => fetchPosts(nextPage),
    });
  }, [currentPage, queryclient]);

  if (isLoading) return <h3>Loading...</h3>;
  if (isFetching) return <h3>Fetching...</h3>;
  if (isRefetching) return <h3>Refetching...</h3>;
  if (isError)
    return (
      <>
        <h3>Error...</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map(post => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(prev => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= 9}
          onClick={() => {
            setCurrentPage(prev => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} />}
    </>
  );
}
