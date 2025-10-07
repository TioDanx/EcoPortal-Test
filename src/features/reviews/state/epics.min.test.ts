import { of, firstValueFrom } from 'rxjs';
import { fetchMoviesEpic } from './epics';
import { reviewsActions } from './slice';

const runEpicOnce = async (epic: any, action: any, deps: any) =>
  await firstValueFrom(epic(of(action), { value: {} } as any, deps));

test('fetchMoviesEpic dispatches loaded with movies filtering nulls', async () => {
  const mockClient = {
    query: jest.fn().mockResolvedValue({
      data: {
        allMovies: {
          nodes: [
            { id: 'm1', title: 'A', imgUrl: '', releaseDate: '2020-01-01', movieReviewsByMovieId: { nodes: [] } },
            null,
          ],
        },
      },
    }),
  };

  const requestAction = reviewsActions.fetchMoviesRequested();
  const resultAction = await runEpicOnce(fetchMoviesEpic, requestAction, { client: mockClient }) as ReturnType<typeof reviewsActions.fetchMoviesLoaded>;

  expect(resultAction.type).toBe(reviewsActions.fetchMoviesLoaded.type);
  expect(resultAction.payload.movies).toHaveLength(1);
  expect(resultAction.payload.movies[0].id).toBe('m1');
});
