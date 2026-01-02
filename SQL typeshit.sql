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



name: credit_purchases
id (bigint)
user_id (uuid)
package_amount (smallint)
amount_paid (integer)
payment_method (	gcash, cash)
created_at (timestamptz)
purchase_state (	pending, paid)
package_id (bigint)

name: user_packages
user_package_id (bigint)
user_id (uuid)
expiration_date (timestamptz)
credits_remaining (smallint)
status (	active, expired, used_up)
purchased_at (timestamptz)
transaction_id (bigint)
package_id (bigint)


table name: attendance 
attendance_id (bigint) 
user_id (uuid) 
user_package_id (bigint) 
check_in (timestamptz) 
check_out (timestamptz) 
checkin_approved (bool)



table name: profiles 
id (uuid)
full_name (text)
role (text)
credits_balance (integer)
created_at (timestamptz)
updated_at (timestamptz)
checked_in (bool)

table name: store_items
id (uuid) primary key
name (text)
description (text)
price (numeric)
stock (integer)
created_at (timestamptz)
featured (bool)
image_url (text)


table name: user_cart
user_id (uuid) primary key user_id -> public.profiles.id (reference)
name (text) 
price (numeric)
image (text)
quantity (integer)
created_at (timestamptz)
updated_at (timestamptz)
product_id (uuid) primary key


    table name: user_cart
    cart_id (uuid)
    user_id (uuid) (relation) user_id->public.profiles.id
    product_id (uuid) (relation) product_id->public.store_items.id
    quantity (integer)
    created_at (timestampz)





table name: order_items
id (uuid) primary key
order_id (uuid) order_id -> public.order_groups.id (reference)
item_id (uuid) item_id -> public.store_items.id (reference)
quantity (integer)
unit_price (numeric)
total (numeric)

    table name: order_items
    id (uuid) primary key
    order_id (uuid) (relation) order_id -> public.order_groups.id 
    item_id (uuid) (relation) item_id -> public.store_items.id
    quantity (integer)
    unit_price (numeric)
    total (numeric)





table name: order_groups
id (uuid) primary key
user_id (uuid) user_id -> public.profiles.id (reference)
total_amount (numeric)
created_at (timestamptz)
updated_at (timestamptz)
status (text)

    table name: order_groups
    id (uuid) primary key
    user_id (uuid) user_id -> public.profiles.id
    total_amount (numeric)
    created_at (timestamptz)
    updated_at (timestamptz)
    status (Pending, Completed, Out of Stock)
    paid_on (timestampz)
    payment_method (gcash, cash)






this:
name: user_packages
user_package_id (bigint)
user_id (uuid)
expiration_date (timestamptz)
credits_remaining (smallint)
status (	active, expired, used_up)
purchased_at (timestamptz)
transaction_id (bigint)
package_id (bigint)

i want a cron every hour that check user_packages.expiration_date if now is same as or past the user_packages.expiration_date then update the user_packages.status to expired












so this db:
table name: store_items
id (uuid) primary key
name (text)
description (text)
price (numeric)
stock (integer)
created_at (timestamptz)
featured (bool)
image_url (text)

make a trigger when that listens to the changes in store_items.stock

if there is a change only if its less than before

then:

this:
table name: order_items
    id (uuid) primary key
    order_id (uuid) (relation) order_id -> public.order_groups.id 
    item_id (uuid) (relation) item_id -> public.store_items.id
    quantity (integer)
    unit_price (numeric)
    total (numeric)

with the the store_items with the changes of the stock check any order_items that is order_items.quantity > store_items.stock and then

This db:
table name: order_groups
    id (uuid) primary key
    user_id (uuid) user_id -> public.profiles.id
    total_amount (numeric)
    created_at (timestamptz)
    updated_at (timestamptz)
    status (Pending, Completed, Out of Stock)
    paid_on (timestampz)
    payment_method (gcash, cash)

check if the reference product order_groups.status if its pending and if it is pending change it to out of stock















this db:
table name: order_groups
    id (uuid) primary key
    user_id (uuid) user_id -> public.profiles.id
    total_amount (numeric)
    created_at (timestamptz)
    updated_at (timestamptz)
    status (Pending, Completed, Out of Stock)
    paid_on (timestampz)
    payment_method (gcash, cash)

make a trigger when status == Completed then paid_on == curent timestamp

Then
with this db:

table name: store_items
id (uuid) primary key
name (text)
description (text)
price (numeric)
stock (integer)
created_at (timestamptz)
featured (bool)
image_url (text)

table name: order_items 
    id (uuid) primary key
    order_id (uuid) (relation) order_id -> public.order_groups.id 
    item_id (uuid) (relation) item_id -> public.store_items.id
    quantity (integer)
    unit_price (numeric)
    total (numeric)

with every order_items.order_id == the one that status get == completed, get its order_items.quantity for every product then for every product store_items.stock get subtracted on order_items.quantity




GRANT EXECUTE ON FUNCTION public.ORDER_ITEMS_ORDER_GROUPS_CheckoutOrder(uuid) TO authenticated;








so i have this these tb: table name: attendance attendance_id (bigint) user_id (uuid) user_package_id (bigint) check_in (timestamptz) check_out (timestamptz) checkIn_Approved (bool) name: user_packages user_package_id (bigint) user_id (uuid) expiration_date (timestamptz) credits_remaining (smallint) status ( active, expired, used_up) purchased_at (timestamptz) transaction_id (bigint) package_id (bigint) i want a trigger when checkIn_Approved become true then: check for this: if attendance.user_package_id.status = active attendance.user_package_id.credits_remaining > 1 if these are not true then u cannot make checkIn_Approved = true then: separate trigger: if checkIn_Approved = true then: attendance.check_in (current time) attendance.user_id.checked_in = true attendance.user_package_id.credits_remaining - 1 then another separate trigger: if checkIn_Approved comes from true then changed to false then: attendance.check_in = null attendance.user_id.checked_in = true attendance.user_package_id.credits_remaining + 1


https://chatgpt.com/c/69181a8d-2980-8322-a970-8d78035f635f

//PAPA ACCOUNT 



DECLARE
    cart_row RECORD;
    new_order_group_id uuid;
    total_amount numeric := 0;
BEGIN
    -- 1️⃣ Ensure user_cart is not empty
    IF NOT EXISTS (
        SELECT 1 FROM user_cart WHERE user_id = user_id
    ) THEN
        RAISE EXCEPTION 'User cart is empty.';
    END IF;

    -- Compute total
    FOR cart_row IN
        SELECT uc.cart_id, uc.quantity, si.id AS product_id, si.price
        FROM user_cart uc
        JOIN store_items si ON si.id = uc.product_id
        WHERE uc.user_id = user_id
    LOOP
        total_amount := total_amount + (cart_row.price * cart_row.quantity);
    END LOOP;

    -- Create order_items
    FOR cart_row IN
        SELECT uc.cart_id, uc.quantity, si.id AS product_id, si.price
        FROM user_cart uc
        JOIN store_items si ON si.id = uc.product_id
        WHERE uc.user_id = user_id
    LOOP
        INSERT INTO order_items (order_id, item_id, quantity, unit_price, total)
        VALUES (new_order_group_id, cart_row.product_id, cart_row.quantity, cart_row.price, cart_row.price * cart_row.quantity);
    END LOOP;

    -- Clear cart
    DELETE FROM user_cart WHERE user_id = user_id;

    -- 6️⃣ Return final order summary as JSON
    RETURN json_build_object(
        'order_group_id', new_order_group_id,
        'total_amount', total_amount,
        'status', 'pending'
    );
END;



DECLARE
    cart_row RECORD;
    new_order_group_id uuid;
    total_amount numeric := 0;
BEGIN
    -- Ensure cart is not empty
    IF NOT EXISTS (
        SELECT 1 FROM user_cart WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User cart is empty.';
    END IF;

    -- Compute total
    FOR cart_row IN
        SELECT uc.cart_id, uc.quantity, si.id AS product_id, si.price
        FROM user_cart uc
        JOIN store_items si ON si.id = uc.product_id
        WHERE uc.user_id = p_user_id
    LOOP
        total_amount := total_amount + (cart_row.price * cart_row.quantity);
    END LOOP;

    -- Create order group
    INSERT INTO order_groups (user_id, total_amount, status)
    VALUES (p_user_id, total_amount, 'pending')
    RETURNING id INTO new_order_group_id;

    -- Create order_items
    FOR cart_row IN
        SELECT uc.cart_id, uc.quantity, si.id AS product_id, si.price
        FROM user_cart uc
        JOIN store_items si ON si.id = uc.product_id
        WHERE uc.user_id = p_user_id
    LOOP
        INSERT INTO order_items (order_id, item_id, quantity, unit_price)
        VALUES (new_order_group_id, cart_row.product_id, cart_row.quantity, cart_row.price);
    END LOOP;

    -- Clear cart
    DELETE FROM user_cart WHERE user_id = p_user_id;

    -- Return summary
    RETURN json_build_object(
        'order_group_id', new_order_group_id,
        'total_amount', total_amount,
        'status', 'pending'
    );
END;



declare
    result jsonb;
begin
    select jsonb_agg(order_group_data) into result
    from (
        select 
            og.id,
            og.user_id,
            og.total_amount,
            og.created_at,
            og.updated_at,
            og.status,

            -- Nested order_items
            (
                select jsonb_agg(
                    jsonb_build_object(
                        'id', oi.id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'total', oi.total,

                        -- Product data
                        'item', (
                            select to_jsonb(si)
                            from store_items si
                            where si.id = oi.item_id
                        )
                    )
                )
                from order_items oi
                where oi.order_id = og.id
            ) as items

        from order_groups og
        where og.user_id = p_user_id
        order by og.created_at desc
    ) order_group_data;

    return result;
end;



declare
    result jsonb;
begin
    select jsonb_build_object(
        'order_groups',
        jsonb_agg(order_group_data)
    ) into result
    from (
        select 
            og.id,
            og.user_id,
            og.total_amount,
            og.created_at,
            og.updated_at,
            og.status,
            og.paid_on,
            og.payment_method,

            -- Renamed: order_items
            (
                select jsonb_agg(
                    jsonb_build_object(
                        'id', oi.id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'total', oi.total,

                        -- Renamed: product
                        'product', (
                            select to_jsonb(si)
                            from store_items si
                            where si.id = oi.item_id
                        )
                    )
                )
                from order_items oi
                where oi.order_id = og.id
            ) as order_items

        from order_groups og
        where og.user_id = p_user_id
        order by
        case og.status
            when 'Pending' then 0
            when 'Out of Stock' then 1
            when 'Completed' then 2
            else 3
        end,
        og.created_at desc
    ) order_group_data;

    return result;
end;