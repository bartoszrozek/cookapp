from datetime import datetime, timezone

def time_now():
    """
    Returns the current date and time in UTC.

    Uses the system clock to obtain the current time as a timezone-aware
    datetime object set to UTC.

    Returns:
        datetime: The current UTC date and time.
    """
    return datetime.now(timezone.utc)