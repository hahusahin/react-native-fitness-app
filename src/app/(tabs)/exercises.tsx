import React, { useState, useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import ExerciseCard from "../../components/ExerciseCard";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import ExerciseCardSkeleton from "../../components/ExerciseCardSkeleton";
import { useGetExercises } from "../../hooks/useExercises";
import { useRouter } from "expo-router";

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: exercises,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetExercises();

  const router = useRouter();

  // Filter exercises based on search query
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    if (!searchQuery.trim()) return exercises;

    const query = searchQuery.toLowerCase().trim();
    return exercises.filter(
      (exercise) =>
        exercise.name?.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.difficulty?.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ErrorState title="Unable to load exercises" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header Section */}
      <View className="px-4 py-2">
        <Text className="text-3xl font-lexend-semibold text-center text-gray-900 mb-2">
          Exercises
        </Text>
        <Text className="text-gray-600 text-sm leading-5">
          Discover a variety of exercises to build your perfect workout routine.
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-4 pb-4">
        <CustomInput
          placeholder="Search exercise..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Ionicons name="search" size={20} color="#6b7280" />}
        />
      </View>

      {/* Exercises List */}
      {isLoading ? (
        <ExerciseCardSkeleton />
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
            />
          )}
          contentContainerClassName="px-2"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={Platform.OS === "android" ? ["#00a727"] : undefined}
              tintColor={Platform.OS === "ios" ? "#00a727" : undefined}
              title={Platform.OS === "ios" ? "Pull to refresh" : undefined}
              titleColor={Platform.OS === "ios" ? "#6b7280" : undefined}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyState
                title={
                  searchQuery ? "No exercises found" : "No exercises available"
                }
                message={
                  searchQuery
                    ? `No exercises match "${searchQuery}". Try adjusting your search.`
                    : "Check back later for new exercises."
                }
                icon="fitness-outline"
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
