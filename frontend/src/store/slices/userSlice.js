import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchHistory,
  addToHistory,
  clearHistory,
  getWatchlistApi,
  addToWatchlistApi,
  removeFromWatchlistApi,
  getRatingsApi,
  rateItemApi,
  removeRatingApi,
} from '../../services/backendApi';

export const fetchFavorites = createAsyncThunk('user/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getFavorites();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const toggleFavorite = createAsyncThunk('user/toggleFavorite', async (movie, { getState, rejectWithValue }) => {
  try {
    const { favorites } = getState().user;
    const isFav = favorites.some((f) => f.tmdbId === movie.tmdbId);
    if (isFav) {
      await removeFavorite(movie.tmdbId);
      return { action: 'removed', tmdbId: movie.tmdbId };
    } else {
      const { data } = await addFavorite(movie);
      return { action: 'added', favorites: data.favorites };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchWatchHistory = createAsyncThunk('user/fetchWatchHistory', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getWatchHistory();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const recordWatch = createAsyncThunk('user/recordWatch', async (movie, { rejectWithValue }) => {
  try {
    const { data } = await addToHistory(movie);
    return data.watchHistory;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const clearWatchHistory = createAsyncThunk('user/clearWatchHistory', async (_, { rejectWithValue }) => {
  try {
    await clearHistory();
    return [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchWatchlist = createAsyncThunk('user/fetchWatchlist', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getWatchlistApi();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const toggleWatchlist = createAsyncThunk('user/toggleWatchlist', async (movie, { getState, rejectWithValue }) => {
  try {
    const { watchlist } = getState().user;
    const isIn = watchlist.some((w) => w.tmdbId === movie.tmdbId);
    if (isIn) {
      await removeFromWatchlistApi(movie.tmdbId);
      return { action: 'removed', tmdbId: movie.tmdbId };
    } else {
      const { data } = await addToWatchlistApi(movie);
      return { action: 'added', watchlist: data.watchlist };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchRatings = createAsyncThunk('user/fetchRatings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getRatingsApi();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const rateItem = createAsyncThunk('user/rateItem', async ({ tmdbId, mediaType, rating }, { rejectWithValue }) => {
  try {
    const { data } = await rateItemApi({ tmdbId, mediaType, rating });
    return data.ratings;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeRating = createAsyncThunk('user/removeRating', async (tmdbId, { rejectWithValue }) => {
  try {
    const { data } = await removeRatingApi(tmdbId);
    return data.ratings;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    favorites: [],
    watchHistory: [],
    watchlist: [],
    ratings: [],
    loadingFavorites: false,
    loadingHistory: false,
  },
  reducers: {
    clearUserData: (state) => {
      state.favorites = [];
      state.watchHistory = [];
      state.watchlist = [];
      state.ratings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loadingFavorites = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loadingFavorites = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state) => { state.loadingFavorites = false; })

      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.favorites = state.favorites.filter((f) => f.tmdbId !== action.payload.tmdbId);
        } else {
          state.favorites = action.payload.favorites;
        }
      })

      .addCase(fetchWatchHistory.pending, (state) => { state.loadingHistory = true; })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.watchHistory = action.payload;
      })
      .addCase(fetchWatchHistory.rejected, (state) => { state.loadingHistory = false; })

      .addCase(recordWatch.fulfilled, (state, action) => {
        state.watchHistory = action.payload;
      })

      .addCase(clearWatchHistory.fulfilled, (state) => {
        state.watchHistory = [];
      })

      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })

      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        if (action.payload.action === 'removed') {
          state.watchlist = state.watchlist.filter((w) => w.tmdbId !== action.payload.tmdbId);
        } else {
          state.watchlist = action.payload.watchlist;
        }
      })

      .addCase(fetchRatings.fulfilled, (state, action) => { state.ratings = action.payload; })
      .addCase(rateItem.fulfilled, (state, action) => { state.ratings = action.payload; })
      .addCase(removeRating.fulfilled, (state, action) => { state.ratings = action.payload; });
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
