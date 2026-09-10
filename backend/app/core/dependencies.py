"""Authentication and authorization dependencies."""

from typing import Callable

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.security import ALGORITHM, SECRET_KEY


security = HTTPBearer()


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify the JWT bearer token and return its payload."""
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


def require_roles(*allowed_roles: str) -> Callable:
    """Create a dependency that allows only the specified roles."""

    def role_checker(
        payload: dict = Depends(verify_token),
    ) -> dict:
        """Check whether the authenticated user has an allowed role."""
        user_role = payload.get("role")

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions",
            )

        return payload

    return role_checker