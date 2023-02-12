#################################################
# CMakeLists.txt				#
# Original by PANCHO7532, 10/Dec/2022		#
#################################################
# Super rough state, but it does it's job
cmake_minimum_required(VERSION 2.8.11)
project(uwuApp)
if(NOT USE_GTK)
	set(USE_GTK 1) # change to 1 for using GTK by default, you can also toggle this with -DUSE_GTK
endif()
if(NOT CMAKE_BUILD_TYPE)
	set(CMAKE_BUILD_TYPE "Release") # set to Release build by default
	message("[INFO] No build type specified, using ${CMAKE_BUILD_TYPE}")
endif()
message("[INFO] Build type: ${CMAKE_BUILD_TYPE}")
if(CMAKE_BUILD_TYPE EQUAL "RelWithDebInfo" OR CMAKE_BUILD_TYPE EQUAL "MinSizeRel")
	message(FATAL_ERROR "This project can only be used with Debug or Release configurations.")
endif()

# Setting specific compiler flags for each build
set(CMAKE_CXX_FLAGS_DEBUG "-O0 -g -Wall")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -s -Wall -Werror")
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF) # enable/disable GNU std specification/extension

# Setting output directories
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG "${PROJECT_SOURCE_DIR}/app/bin/${CMAKE_HOST_SYSTEM_PROCESSOR}-debug")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE "${PROJECT_SOURCE_DIR}/app/bin/${CMAKE_HOST_SYSTEM_PROCESSOR}-retail")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_DEBUG "${PROJECT_SOURCE_DIR}/app/bin/${CMAKE_HOST_SYSTEM_PROCESSOR}-debug")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_RELEASE "${PROJECT_SOURCE_DIR}/app/bin/${CMAKE_HOST_SYSTEM_PROCESSOR}-retail")

# Retrieving a list of all the source files that matches this extension
file(GLOB srcfiles "${PROJECT_SOURCE_DIR}/src/*.cpp")

if(USE_GTK GREATER_EQUAL 1)
	# GTK stuff (check: https://github.com/shlomif/gtk3-cmake-examples/blob/master/CMakeLists.txt)
	message("[INFO] GTK is enabled for this project!")
	find_package(PkgConfig REQUIRED)
	# GTK C-like API only: pkg_check_modules(GTK3 REQUIRED gtk+-3.0)
	# Be sure to add ${GTK3_INCLUDE_DIRS} and ${GTK3_LIBRARY_DIRS} on includes and link dirs
	# Only add CFLAGS for only one of them (either gtk3 or gtk3mm)... or both, it's on you.
	pkg_check_modules(GTKMM REQUIRED gtkmm-3.0)
	include_directories(${GTKMM_INCLUDE_DIRS})
	link_directories(${GTKMM_LIBRARY_DIRS})
	add_definitions(${GTKMM_CFLAGS_OTHER})
else()
	message("[INFO] GTK is disabled for this project!")
endif()

# Generate executable
add_executable(${PROJECT_NAME} ${srcfiles})

if(USE_GTK GREATER_EQUAL 1)
	# GTK stuff (check: https://github.com/shlomif/gtk3-cmake-examples/blob/master/CMakeLists.txt)
	# If you're going to use an GTK3 (not GTKmm) then replace ${GTKMM_LIBRARIES} with ${GTK3_LIBRARIES}
	target_link_libraries(${PROJECT_NAME} ${GTKMM_LIBRARIES})
endif()
