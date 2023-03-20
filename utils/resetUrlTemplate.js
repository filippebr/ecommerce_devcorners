const resetUrlTemplate = (token) => {
  return (
    `Hi user. \n\nYou forgot your password? Do not have any problem, use this token: {${token}}.`   
  )    
    
}

module.exports = resetUrlTemplate;