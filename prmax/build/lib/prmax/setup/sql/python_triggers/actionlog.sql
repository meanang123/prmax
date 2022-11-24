DROP FUNCTION IF EXISTS prmax_action_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_action_index ()
  RETURNS trigger
  AS $$
  BEGIN

  NEW.when_date = current_date;

  RETURN NEW;

  END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER action_log_insert BEFORE INSERT ON actionlog for each row EXECUTE PROCEDURE prmax_action_index();