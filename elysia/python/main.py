def linear_search(arr, target):
    n = len(arr)
    for i in range(0,n):
        if arr[i] == target:
            return i
    return -1

def binary_search(arr, target):
    left = 0
    right = len(arr) - 1  
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            right = mid - 1 
        else:
            left = mid + 1 
    return -1  
    
    
arr = [1,2,3,4,5,6,7,8,9]
data = binary_search(arr , 6)

print(data)

def swap(x,y):
    x,y = y,x
    
def reverse_array(arr):
    left = 0
    right = len(arr) - 1  
        
    while left <= right:
        swap(arr[left], arr[right])
        
print(reverse_array(arr))
