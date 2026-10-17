-- Allow admin uploads up to 30 MB (was 5 MB).
update storage.buckets set file_size_limit = 31457280 where id = 'product-images';
