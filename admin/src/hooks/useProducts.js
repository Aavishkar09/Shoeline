import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, uploadAPI } from '../services/api';

// Query keys for consistent cache management
export const QUERY_KEYS = {
  PRODUCTS: ['products'],
  PRODUCT: (id) => ['products', id],
};

// Custom hook for fetching all products
export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: productAPI.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes - reasonable balance
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};

// Custom hook for deleting a product
export const useDeleteProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productAPI.delete,
    onSuccess: (data, deletedId) => {
      // Optimistically update the cache
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(product => product.id !== deletedId);
      });

      // Invalidate and refetch products to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      
      options.onSuccess?.(data, deletedId);
    },
    onError: (error, deletedId) => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      options.onError?.(error, deletedId);
    },
    ...options,
  });
};

// Custom hook for creating a product
export const useCreateProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productAPI.create,
    onSuccess: (data) => {
      // Optimistically add new product to cache
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS, (oldData) => {
        if (!oldData) return [data];
        return [data, ...oldData];
      });

      // Invalidate to ensure server consistency
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PRODUCTS 
      });
      
      options.onSuccess?.(data);
    },
    onError: (error) => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      options.onError?.(error);
    },
    ...options,
  });
};

// Custom hook for uploading images
export const useUploadImage = (options = {}) => {
  return useMutation({
    mutationFn: uploadAPI.uploadImage,
    ...options,
  });
};

// Custom hook for updating a product
export const useUpdateProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productAPI.update(id, data),
    onSuccess: (data, { id }) => {
      // Update specific product in cache
      queryClient.setQueryData(QUERY_KEYS.PRODUCT(id), data);
      
      // Invalidate products list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      
      options.onSuccess?.(data, { id });
    },
    onError: (error, { id }) => {
      options.onError?.(error, { id });
    },
    ...options,
  });
};