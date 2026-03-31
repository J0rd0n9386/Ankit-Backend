
//promises se
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }
}

export { asyncHandler };

// const asyncHandler = () => {}

// const asyncHandler = (func) => {()=>{}}  // ye aur neeche same hai bss curly braces ka htaa diya hai
// it is a higher order function in function is passed as an argument
//const asyncHandler = (func) => ()=>{} // it is also a higher order function in function is passed as an argument


//async await se 

// const asyncHandler = (func) => async (req, res, next)=>{
//            try{
//             await fn(req, res, next)

//            }catch (error){
//             res.status(err.code || 500).json({
//                 success: false,
//                 message: err.message
//             })
//            }

// }