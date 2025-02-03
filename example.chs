type FD distinct int

use "io.chs"

fn main()
    x := "hello"
    syscall(1, 1, x, len x)
end
