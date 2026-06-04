/*
  # Create study materials storage bucket and policies

  1. Storage
    - Create `study-materials` bucket for teacher file uploads
    - Allow authenticated teachers to upload files
    - Allow authenticated users to read/download files
    - Allow teachers to delete their own uploads

  2. Security
    - Storage RLS policies for upload, read, and delete
    - Only authenticated users can access the bucket
    - Teachers can only delete files they uploaded
*/

-- Create the storage bucket for study materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'video/mp4', 'video/webm', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg', 'image/png', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read/download files
CREATE POLICY "Authenticated users can view study materials"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'study-materials');

-- Allow teachers to upload files
CREATE POLICY "Teachers can upload study materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'study-materials'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow teachers to delete their own files
CREATE POLICY "Teachers can delete own study materials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'study-materials'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow teachers to update their own files
CREATE POLICY "Teachers can update own study materials"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'study-materials'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'study-materials'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
