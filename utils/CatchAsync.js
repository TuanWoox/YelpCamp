module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next)
    }
}

//It directly passes next to the .catch() method, which implicitly passes the error to next