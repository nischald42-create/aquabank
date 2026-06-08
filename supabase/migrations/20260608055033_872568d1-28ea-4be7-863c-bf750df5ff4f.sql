DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT user_id INTO admin_user_id
  FROM public.profiles
  WHERE lower(email) = 'aquabank@gmail.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    DELETE FROM public.user_roles
    WHERE user_id = admin_user_id
      AND role = 'user'::public.app_role;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'aquabank@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;