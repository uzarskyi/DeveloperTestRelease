interface IUserService
{
    Task<IEnumerable<UserDto>> GetUsersAsync();
}
