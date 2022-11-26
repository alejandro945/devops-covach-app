import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.user_schemas import AuthUserSchema
from app.config import get_settings


# class AuthHandler:
security = HTTPBearer()

def decode_token(token: str) -> dict:
    """
    This function is used to decode the token.
    """
    response = requests.get(
        f"{get_settings().auth_service_base_url}/api/externalauth/",
        headers={"Authorization": f"Bearer {token}"},
    )
    if response.status_code == 200:
        user_data = response.json()
        return AuthUserSchema(**user_data)
    raise HTTPException(status_code=403, detail="User inactive or deleted")

def auth_wrapper(auth: HTTPAuthorizationCredentials = Security(security)):
    """
    This function is used to wrap the request.
    """
    print(auth)
    return decode_token(auth.credentials)
