-- Allow authenticated users to look up any account (needed for transfers)
CREATE POLICY "Authenticated users can look up accounts"
ON public.accounts
FOR SELECT
TO authenticated
USING (true);
