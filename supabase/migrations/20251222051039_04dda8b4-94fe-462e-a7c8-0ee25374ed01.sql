
-- Create accounts table
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  account_name TEXT NOT NULL DEFAULT 'Checking',
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for transfer statements
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  to_account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  from_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'transfer',
  status TEXT NOT NULL DEFAULT 'completed',
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Accounts RLS policies
CREATE POLICY "Users can view their own accounts" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all accounts" ON public.accounts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage accounts" ON public.accounts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Transactions RLS policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create transactions from their accounts" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage transactions" ON public.transactions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create account for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_account_number TEXT;
BEGIN
  -- Generate unique account number (6-10 digits)
  new_account_number := LPAD(FLOOR(RANDOM() * 9999999999)::TEXT, 10, '0');
  
  INSERT INTO public.accounts (user_id, account_number, account_name, balance)
  VALUES (NEW.id, new_account_number, 'Checking', 0);
  
  RETURN NEW;
END;
$$;

-- Trigger to create account when user is created
CREATE TRIGGER on_auth_user_created_account
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_account();
