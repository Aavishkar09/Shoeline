import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, cartAPI } from '../services/api';

export const QUERY_KEYS = {
  PRODUCTS: ['products'],
  NEW_COLLECTION: ['products', 'new-collection'],
  POPULAR_WOMEN: ['products', 'popular', 'women'],
  POPULAR_MEN: ['products', 'popular', 'men'],
  CART: ['cart'],
};

export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: productAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewCollection = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NEW_COLLECTION,
    queryFn: productAPI.getNewCollection,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const usePopularInWomen = () => {
  return useQuery({
    queryKey: QUERY_KEYS.POPULAR_WOMEN,
    queryFn: productAPI.getPopularInWomen,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const usePopularInMen = () => {
  return useQuery({
    queryKey: QUERY_KEYS.POPULAR_MEN,
    queryFn: productAPI.getPopularInMen,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: cartAPI.get,
    enabled: !!localStorage.getItem('auth-token'),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartAPI.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartAPI.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};