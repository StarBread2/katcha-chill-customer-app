DECLARE
  pkg RECORD;
  existing_up RECORD;
  expiry TIMESTAMPTZ;
  credits_to_add integer;
  new_credits bigint;
  total_credits bigint;
BEGIN
  -- Only trigger when purchase changes to 'paid'
  IF NEW.purchase_state = 'paid' AND OLD.purchase_state IS DISTINCT FROM 'paid' THEN
    -- Fetch the package details
    SELECT * INTO pkg FROM credit_packages WHERE package_id = NEW.package_id;

    -- Check if package exists
    IF NOT FOUND THEN
      RAISE WARNING '⚠️ No credit package found for package_id: %', NEW.package_id;
      RETURN NEW;
    END IF;

    -- DO THE CALCULATIONS
    -- Determine credits to add from this purchase: package.credit_count * package_amount
    credits_to_add := COALESCE(pkg.credit_count, 0) * COALESCE(NEW.package_amount, 0);

    -- Compute expiration date safely
    IF pkg.expiration_days IS NOT NULL THEN
      expiry := now() + (pkg.expiration_days || ' days')::INTERVAL;
    ELSE
      expiry := NULL;
    END IF;

    -- Look for an existing active user_packages row for this user + package
    SELECT *
    INTO existing_up
    FROM user_packages
    WHERE user_id = NEW.user_id
      AND package_id = NEW.package_id
      AND status = 'active'
    LIMIT 1;
    -- DO THE CALCULATIONS


    -- If an active package already exists:
    IF FOUND THEN
      -- If package is NOT stackable, disallow repeated order
      IF pkg.stackable = FALSE THEN
        RAISE EXCEPTION 'Package % is not stackable: cannot purchase the same package again while an active package exists for this user.', NEW.package_id;
      END IF;

      -- pkg.stackable = true: add credits and update purchased_at, expiration_date, transaction_id
      -- Compute new credits (use bigint to avoid smallint overflow temporarily)
      new_credits := COALESCE(existing_up.credits_remaining, 0)::bigint + credits_to_add::bigint;

      UPDATE user_packages
      SET
        credits_remaining = new_credits::smallint,
        purchased_at      = now(),
        expiration_date   = expiry,
        transaction_id    = NEW.id
      WHERE user_package_id = existing_up.user_package_id;


    ELSE
      -- Insert into user_packages, include transaction_id
      INSERT INTO user_packages (
        user_id,
        package_id,
        expiration_date,
        credits_remaining,
        status,
        purchased_at,
        transaction_id
      ) VALUES (
        NEW.user_id,
        NEW.package_id,
        expiry,
        LEAST(COALESCE(pkg.credit_count, 0) * COALESCE(NEW.package_amount, 0), 32767)::smallint,
        'active',
        now(),
        NEW.id -- link to credit_purchases.id
      );
    END IF;
    
    -- Recalculate user's total credits
    SELECT COALESCE(SUM(credits_remaining), 0)
    INTO total_credits
    FROM user_packages
    WHERE user_id = NEW.user_id
      AND status = 'active';  -- optional filter, if you only count active ones

    -- Update user's balance
    UPDATE profiles
    SET credits_balance = total_credits
    WHERE id = NEW.user_id;


  END IF;

  RETURN NEW;
END;



check if the credit_purchases.package_id is already in user_packages.package_id (with the same user_id (means they have order it before)) that is user_packages.status = active

if it is already there then, check the credit_purchases.package_amount depending on that credit_purchases.package_id.credit_count x credit_purchases.package_amount, then thats the new value for user_packages.credits_remaining 
then update the user_packages.purchased_at to now (its like adding to the previous user_packages )

else just make the normal way in there

and btw u can only do this if credit_purchases.package_id.stackable is true or not, if its false then throw an error ("No repeated order or sometinhg")













so i want to scan if the current credit_purchases.package_id.stackable is true or not:

if it is true then check if the credit_purchases.package_id is already in user_packages.package_id (with the same user_id (means they have order it before))

after that check the credit_purchases.package_amount depending on that credit_purchases.package_id.credit_count x credit_purchases.package_amount, then thats the new value for user_packages.credits_remaining 
then update the user_packages.purchased_at to now

else if its false then throw an error ("Repeated buy is fporbiden or something")





DECLARE
  pkg RECORD;
  existing_up RECORD;
  expiry TIMESTAMPTZ;
  credits_to_add integer;
  new_credits bigint;
  total_credits bigint;
BEGIN
  -- Only trigger when purchase changes to 'paid'
  IF NEW.purchase_state = 'paid' AND OLD.purchase_state IS DISTINCT FROM 'paid' THEN
    -- Fetch the package details
    SELECT * INTO pkg FROM credit_packages WHERE package_id = NEW.package_id;

    -- Check if package exists
    IF NOT FOUND THEN
      RAISE WARNING '⚠️ No credit package found for package_id: %', NEW.package_id;
      RETURN NEW;
    END IF;

    -- DO THE CALCULATIONS
    -- Determine credits to add from this purchase: package.credit_count * package_amount
    credits_to_add := COALESCE(pkg.credit_count, 0) * COALESCE(NEW.package_amount, 0);

    -- Compute expiration date safely
    IF pkg.expiration_days IS NOT NULL THEN
      expiry := now() + (pkg.expiration_days || ' days')::INTERVAL;
    ELSE
      expiry := NULL;
    END IF;

    -- Look for an existing active user_packages row for this user + package
    SELECT *
    INTO existing_up
    FROM user_packages
    WHERE user_id = NEW.user_id
      AND package_id = NEW.package_id
      AND status = 'active'
    LIMIT 1;
    -- DO THE CALCULATIONS


    -- If an active package already exists:
    IF FOUND THEN
      -- If package is NOT stackable, disallow repeated order
      IF pkg.stackable = FALSE THEN
        RAISE EXCEPTION 'Package % is not stackable: cannot purchase the same package again while an active package exists for this user.', NEW.package_id;
      END IF;

      -- pkg.stackable = true: add credits and update purchased_at, expiration_date, transaction_id
      -- Compute new credits (use bigint to avoid smallint overflow temporarily)
      new_credits := COALESCE(existing_up.credits_remaining, 0)::bigint + credits_to_add::bigint;

      UPDATE user_packages
      SET
        credits_remaining = new_credits::smallint,
        purchased_at      = now(),
        expiration_date   = expiry,
        transaction_id    = NEW.id
      WHERE user_package_id = existing_up.user_package_id;


    ELSE
      -- Insert into user_packages, include transaction_id
      INSERT INTO user_packages (
        user_id,
        package_id,
        expiration_date,
        credits_remaining,
        status,
        purchased_at,
        transaction_id
      ) VALUES (
        NEW.user_id,
        NEW.package_id,
        expiry,
        LEAST(COALESCE(pkg.credit_count, 0) * COALESCE(NEW.package_amount, 0), 32767)::smallint,
        'active',
        now(),
        NEW.id -- link to credit_purchases.id
      );
    END IF;
    
    -- Recalculate user's total credits
    SELECT COALESCE(SUM(credits_remaining), 0)
    INTO total_credits
    FROM user_packages
    WHERE user_id = NEW.user_id
      AND status = 'active';  -- optional filter, if you only count active ones

    -- Update user's balance
    UPDATE profiles
    SET credits_balance = total_credits
    WHERE id = NEW.user_id;


  END IF;

  RETURN NEW;
END;








begin
  -- If expiration date has passed, set to 'expired'
  if (NEW.expiration_date < now()) then
    NEW.status := 'expired';

  -- If credits are used up (0 or less) and not expired, set to 'used_up'
  elsif (NEW.credits_remaining <= 0) then
    NEW.status := 'used_up';

  -- Otherwise keep as active
  else
    NEW.status := 'active';
  end if;


  return NEW;
end;


btw this part:





DECLARE
  total_credits bigint;
begin
  -- If expiration date has passed, set to 'expired'
  if (NEW.expiration_date < now()) then
    NEW.status := 'expired';

  -- If credits are used up (0 or less) and not expired, set to 'used_up'
  elsif (NEW.credits_remaining <= 0) then
    NEW.status := 'used_up';

  -- Otherwise keep as active
  else
    NEW.status := 'active';
  end if;

  -- ====== RECALCULATE USER BALANCE ======
  SELECT COALESCE(SUM(credits_remaining), 0)
  INTO total_credits
  FROM user_packages
  WHERE user_id = NEW.user_id
    AND status = 'active';

  UPDATE profiles
  SET credits_balance = total_credits
  WHERE id = NEW.user_id;

  return NEW;
end;


i want u to scan the whole like this:
-- Look for an existing active user_packages row for this user + package
    SELECT *
    INTO existing_up
    FROM user_packages
    WHERE user_id = NEW.user_id
      AND package_id = NEW.package_id
      AND status = 'active'
    LIMIT 1;
    -- DO THE CALCULATIONS

    where active, and then total it btw like that?



DECLARE
  total_credits bigint;
BEGIN
  -- ====== STATUS LOGIC ======
  IF (NEW.expiration_date IS NOT NULL AND NEW.expiration_date < now()) THEN
    NEW.status := 'expired';
  ELSIF (NEW.credits_remaining <= 0) THEN
    NEW.status := 'used_up';
  ELSE
    NEW.status := 'active';
  END IF;

  -- ====== RECALCULATE TOTAL ACTIVE CREDITS ======
  SELECT COALESCE(SUM(credits_remaining), 0)
  INTO total_credits
  FROM user_packages
  WHERE user_id = NEW.user_id
    AND status = 'active';

  -- ====== UPDATE PROFILES TABLE ======
  UPDATE profiles
  SET credits_balance = total_credits
  WHERE id = NEW.user_id;

  RETURN NEW;
END;








USER_PACKAGES_update_PROFILE_CREDITS_BALANCE


DECLARE
  total_credits bigint;
BEGIN

  -- ====== RECALCULATE TOTAL ACTIVE CREDITS ======
  SELECT COALESCE(SUM(credits_remaining), 0)
  INTO total_credits
  FROM user_packages
  WHERE user_id = NEW.user_id
    AND status = 'active';
  
  -- ====== UPDATE PROFILES TABLE ======
  UPDATE profiles
  SET credits_balance = total_credits
  WHERE id = NEW.user_id;

END;