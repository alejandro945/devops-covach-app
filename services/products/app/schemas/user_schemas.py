from pydantic import BaseModel


class AuthUserSchema(BaseModel):
    """
    Class for AuthUser model, this is returned when a user is authenticated by the auth handler
    """

    id: int
