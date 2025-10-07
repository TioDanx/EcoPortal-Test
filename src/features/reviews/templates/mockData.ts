import { GqlMovie } from '../../types/movie';

export const mockMovies: GqlMovie[] = [
  {
    id: '70351289-8756-4101-bf9a-37fc8c7a82cd',
    title: 'Rogue One: A Star Wars Story',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png',
    releaseDate: '2016-12-16',
    movieReviewsByMovieId: {
      nodes: [
        {
          id: '335f0ff2-7f96-413f-8d26-6224039356c4',
          movieId: '70351289-8756-4101-bf9a-37fc8c7a82cd',
          title: 'Best Action Movie',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          rating: 4,
          userByUserReviewerId: {
            id: '65549e6a-2389-42c5-909a-4475fdbb3e69',
            name: 'Ayla',
          },
        },
        {
          id: '5750da72-238b-44b3-9a92-02e3543861c4',
          movieId: '70351289-8756-4101-bf9a-37fc8c7a82cd',
          title: 'One of the best',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          rating: 5,
          userByUserReviewerId: {
            id: '5f1e6707-7c3a-4acd-b11f-fd96096abd5a',
            name: 'Chrono',
          },
        },
      ],
    },
  },
  {
    id: 'b8d93229-e02a-4060-9370-3e073ada86c3',
    title: 'Star Wars: A New Hope',
    imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/81aA7hEEykL.jpg',
    releaseDate: '1977-05-25',
    movieReviewsByMovieId: {
      nodes: [
        {
          id: '3a295d43-da93-4994-8211-4bbccd59d06b',
          movieId: 'b8d93229-e02a-4060-9370-3e073ada86c3',
          title: 'Instant Hit!',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          rating: 4,
          userByUserReviewerId: {
            id: '65549e6a-2389-42c5-909a-4475fdbb3e69',
            name: 'Ayla',
          },
        },
        {
          id: 'e8edc53a-29cf-4470-8351-ed22cc144a3f',
          movieId: 'b8d93229-e02a-4060-9370-3e073ada86c3',
          title: 'Great Movie',
          body:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          rating: 5,
          userByUserReviewerId: {
            id: '5f1e6707-7c3a-4acd-b11f-fd96096abd5a',
            name: 'Chrono',
          },
        },
      ],
    },
  },
];
